import {
  ExpenseRequest,
  ExpenseType,
  FormattedExpense,
  StatementType,
  UrlResponse,
} from '@/lib/api';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';

import {
  TextractClient,
  AnalyzeExpenseCommand,
} from '@aws-sdk/client-textract';
import OpenAI from 'openai';
import postgres from 'postgres';

const textractClient = new TextractClient({ region: 'us-west-2' });
const openai = new OpenAI();
const sql = postgres(process.env.POSTGRES_CONN_URL || '');

const prompt = `You are a data extraction robot. Accuracy is of utmost importance.
You are provided with an expense report (an array of strings) and told to extract information to the best of your ability.
There are extraction settings you must follow to customize how extracted data should be formatted.
Extract the following information from an array of expense reports:
- date: string
- expenseType: "shopping" | "health" | "food" | "services" | "payment"
- vendor: string
- price: string
- location: string

Extraction settings:
- If a field cannot be found, mark it as null. This is the most important.
- Convert all relative dates into actual dates, given that today's date is {date}.
- If a date specifically cannot be found, replace it with the most appropriate date.
- Fields marked as "Payment" should have an "expenseType" of "payment".
- Remove plus signs and dollar signs in front of prices.
- If fields have more than 3 null values, do not include it

Expense reports:
{expense_report}

Only output in JSON and say no additional words.

Output in JSON:`;

export async function POST(request: Request) {
  const expenseRequest: ExpenseRequest = await request.json();

  console.log(expenseRequest);

  const expenseInput = {
    Document: {
      S3Object: {
        Bucket: expenseRequest.file.bucket,
        Name: expenseRequest.file.key,
      },
    },
  };

  const expenseCommand = new AnalyzeExpenseCommand(expenseInput);
  const expenseResponse = await textractClient.send(expenseCommand);

  // Iterate through each "ExpenseDocument" and flatten them into a normal array
  // Then, use ChatGPT to normalize this data to insert into postgres

  // NOTE: This might be better off as an asynchronous operation instead of an API route
  // but right now it doesn't matter

  if (!expenseResponse.ExpenseDocuments) {
    return NextResponse.json('Failed to parse any line items from statement!', {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }

  // Flatten all detected expense rows into a single list
  // e.x.: ['CVS Pharmacy $10.36\nSanta Cruz, CA\n2%\nYesterday', ...]

  console.log('Compressing documents...');
  let expenses: string[] = [];

  for (let document of expenseResponse.ExpenseDocuments) {
    if (!document?.LineItemGroups) {
      continue;
    }

    for (let lineItemGroup of document.LineItemGroups) {
      if (!lineItemGroup?.LineItems) {
        continue;
      }

      for (let lineItem of lineItemGroup.LineItems) {
        if (!lineItem?.LineItemExpenseFields) {
          continue;
        }

        for (let expenseField of lineItem.LineItemExpenseFields) {
          if (
            expenseField.Type?.Text == 'EXPENSE_ROW' &&
            expenseField.ValueDetection?.Text
          ) {
            const expenseText = expenseField.ValueDetection.Text.replace(
              '\n',
              ' '
            );
            expenses.push(expenseText);
          }
        }
      }
    }
  }

  console.log(expenses);
  console.log('Parsing expense reports with ChatGPT...');

  const date = new Date().toLocaleDateString();
  console.log('The current date is: ' + date);

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: prompt
          .replace('{date}', date)
          .replace('{expense_report}', expenses.toString()),
      },
    ],
    model: 'gpt-4',
  });

  let formattedExpenses: FormattedExpense[] = JSON.parse(
    completion.choices[0].message.content || ''
  );

  console.log(formattedExpenses);
  console.log('Inserting into database...');

  for (let expense of formattedExpenses) {
    expense.statementType = expenseRequest.type;

    if (expense.vendor && expense.price) {
      await sql`
        INSERT INTO transactions (
          date, statementType, expenseType, vendor, price, location
        ) VALUES (
          ${expense.date}, ${expense.statementType}, ${expense.expenseType}, ${expense.vendor}, ${expense.price}, ${expense.location}
        )
      `;
    }
  }

  console.log('Finished inserting into database');

  return NextResponse.json(formattedExpenses);
}
