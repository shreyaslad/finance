import { ExpenseRequest, UrlResponse } from '@/lib/api';
import {
  TextractClient,
  AnalyzeExpenseCommand,
} from '@aws-sdk/client-textract';
import { NextResponse } from 'next/server';

const textractClient = new TextractClient({ region: 'us-west-2' });

export async function POST(request: Request) {
  const expenseRequest: ExpenseRequest = await request.json();

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

  return NextResponse.json(expenseResponse.ExpenseDocuments);
}
