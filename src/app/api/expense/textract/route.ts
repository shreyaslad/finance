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

const textractClient = new TextractClient({ region: 'us-west-2' });
const openai = new OpenAI();

const prompt = `Extract the following information from an array of expense reports:
- date: string
- expenseType: "shopping" | "health" | "food" | "services" | "travel" | "payment"
- vendor: string
- price: string
- location: string

- If any fields cannot be properly found, mark them as null.
- Fields marked as "Payment" should have an "expenseType" of "payment" and nothing else.
- Remove the plus sign in front of the price where possible.
- Convert all relative dates into actual dates, given that today's date is {date}.

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
            expenses.push(expenseField.ValueDetection.Text.replace('\n', ' '));
          }
        }
      }
    }
  }

  console.log(expenses);
  console.log('Parsing expense reports with ChatGPT...');

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: prompt
          .replace('{date}', new Date().toDateString())
          .replace('{expense_report}', expenses.toString()),
      },
    ],
    model: 'gpt-3.5-turbo',
  });

  let formattedExpenses: FormattedExpense[] = JSON.parse(
    completion.choices[0].message.content || ''
  );

  for (let expense of formattedExpenses) {
    expense.statementType = expenseRequest.type;
  }

  console.log(formattedExpenses);

  return NextResponse.json(formattedExpenses);
}
