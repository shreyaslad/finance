import {
  ExtractRequest,
  ExpenseType,
  FormattedExpense,
  StatementType,
  UrlResponse,
} from '@/lib/apitypes';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';

import {
  TextractClient,
  AnalyzeExpenseCommand,
} from '@aws-sdk/client-textract';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import postgres from 'postgres';

const textractClient = new TextractClient({ region: 'us-west-2' });
const bedrockClient = new BedrockRuntimeClient({ region: 'us-west-2' });

type ClaudeResponse = {
  completion: string;
  stop_reason: string;
  stop: string;
};

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

Say no additional words. Output in JSON: [`;

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
  console.log('Parsing expense reports with LLM...');

  const date = new Date().toLocaleDateString();
  console.log('The current date is: ' + date);

  // const completion = await openai.chat.completions.create({
  //   messages: [
  //     {
  //       role: 'user',
  //       content: prompt
  //         .replace('{date}', date)
  //         .replace('{expense_report}', expenses.toString()),
  //     },
  //   ],
  //   model: 'gpt-4',
  // });

  const command = new InvokeModelCommand({
    body: JSON.stringify({
      prompt:
        '\n\nHuman:' +
        prompt
          .replace('{date}', date)
          .replace('{expense_report}', expenses.toString()) +
        '\n\nAssistant:',
      temperature: 0.5,
      top_p: 0.999,
      top_k: 250,
      max_tokens_to_sample: 800,
    }),
    contentType: 'application/json',
    modelId: 'anthropic.claude-v2',
  });

  const bedrockRes = await bedrockClient.send(command);
  const claudeResponse: ClaudeResponse = JSON.parse(
    Buffer.from(bedrockRes.body).toString('utf-8')
  );

  console.log('Claude raw response:');
  console.log(claudeResponse);

  let formattedExpenses: FormattedExpense[] = JSON.parse(
    claudeResponse.completion
  );

  console.log(formattedExpenses);

  return NextResponse.json(formattedExpenses);
}
