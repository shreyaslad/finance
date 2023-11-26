import {
  ExtractRequest,
  ExpenseType,
  FormattedExpense,
  StatementType,
  UrlResponse,
} from '@/lib/api';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import { v4 } from 'uuid';

import {
  TextractClient,
  AnalyzeExpenseCommand,
} from '@aws-sdk/client-textract';
import OpenAI from 'openai';

const textractClient = new TextractClient({ region: 'us-west-2' });
const openai = new OpenAI();

const prompt = `You are a data extraction robot. Accuracy is of utmost importance.
You are provided with an expense report (an array of strings) and told to extract information to the best of your ability.

Extract the following information from an array of expense reports:
- date: string
- expenseType: "shopping" | "health" | "food" | "services" | "payment"
- vendor: string
- price: string
- location: string

Extraction settings:
- If a field cannot be found, mark it as null. This is the most important.
- Convert all relative dates into actual dates, given that today's date is {date}.
- Fields marked as "Payment" should have an "expenseType" of "payment".
- Remove plus signs and dollar signs in front of prices.
- If fields have more than 3 null values, do not include it

Expense reports:
{expense_report}

Say no additional words and output a JSON array:`;

export async function POST(request: Request) {
  const extractRequest: ExtractRequest = await request.json();

  console.log(extractRequest);

  const expenseInput = {
    Document: {
      S3Object: {
        Bucket: extractRequest.file.bucket,
        Name: extractRequest.file.key,
      },
    },
  };

  const textractAnalyzeCommand = new AnalyzeExpenseCommand(expenseInput);
  const textractResponse = await textractClient.send(textractAnalyzeCommand);

  // Iterate through each "ExpenseDocument" and flatten them into a normal array
  // Then, use ChatGPT to normalize this data to insert into postgres

  // NOTE: This might be better off as an asynchronous operation instead of an API route
  // but right now it doesn't matter

  if (!textractResponse.ExpenseDocuments) {
    return NextResponse.json('Failed to parse any line items from statement!', {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }

  // Flatten all detected expense rows into a single list
  // e.x.: ['CVS Pharmacy $10.36\nSanta Cruz, CA\n2%\nYesterday', ...]

  console.log('Compressing documents...');
  let expenses: string[] = [];

  for (let document of textractResponse.ExpenseDocuments) {
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
            const expenseText = expenseField.ValueDetection.Text.replaceAll(
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
  console.log('Parsing expense reports with LLM...');

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
    response_format: {
      type: 'json_object',
    },
    model: 'gpt-3.5-turbo-1106',
    temperature: 0.5,
  });

  console.log(completion.choices[0].message.content);

  let rawJSON = JSON.parse(completion.choices[0].message.content || '');

  let formattedExpenses: FormattedExpense[] =
    rawJSON.expenses || rawJSON.expenseReports;

  // Randomly generate an ID for each expense
  for (let expense of formattedExpenses) {
    expense.id = v4();
  }

  console.log(formattedExpenses);

  return NextResponse.json(formattedExpenses);
}
