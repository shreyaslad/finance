import {
  ExpenseRequest,
  ExpenseType,
  StatementType,
  UrlResponse,
} from '@/lib/api';
import {
  TextractClient,
  AnalyzeExpenseCommand,
} from '@aws-sdk/client-textract';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';

type RawExpense = {
  date: string | undefined;
  vendor: string | undefined;
  price: string | undefined;
  location: string | undefined;
};

type FormattedExpense = {
  date: Date | undefined;
  statementType: StatementType | undefined;
  expenseType: ExpenseType | undefined;
  vendor: string | undefined;
  price: string | undefined;
  location: string | undefined;
};

const textractClient = new TextractClient({ region: 'us-west-2' });

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
            expenses.push(expenseField.ValueDetection.Text);
          }
        }
      }
    }
  }

  console.log(expenses);

  return NextResponse.json(expenseResponse.ExpenseDocuments);
}
