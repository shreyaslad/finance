import {
  ExpenseResponse,
  ExpenseType,
  FormattedExpense,
  StatementType,
} from '@/lib/apitypes';
import { Database } from '@/lib/dbtypes';
import { PostgresJSDialect } from 'kysely-postgres-js';
import { Kysely, PostgresDialect } from 'kysely';
import { NextResponse } from 'next/server';
import postgres from 'postgres';

const db = new Kysely<Database>({
  dialect: new PostgresJSDialect({
    postgres: postgres(process.env.POSTGRES_CONN_URL || ''),
  }),
});

export async function GET(request: Request) {
  console.log('/api/expense');
  console.log(request);

  let expenseResponse: ExpenseResponse = {
    spending: 0,
    transactions: [],
  };

  const totalSpending = await db
    .selectFrom('transactions')
    .select(({ fn }) => [fn.sum<number>('transactions.price').as('totalPrice')])
    .execute();

  const transactions = await db
    .selectFrom('transactions')
    .selectAll()
    .orderBy('date desc')
    .execute();

  expenseResponse.spending = Number(totalSpending[0].totalPrice);

  for (let transaction of transactions) {
    expenseResponse.transactions.push({
      id: transaction.id,
      date: transaction.date as string,
      statementType: transaction.statementtype as StatementType,
      expenseType: transaction.expensetype as ExpenseType,
      vendor: transaction.vendor,
      price: Number(transaction.price),
      location: transaction.location,
    });
  }

  console.log('Transactions:');
  console.log(expenseResponse.transactions);

  return NextResponse.json(expenseResponse);
}

export async function POST(request: Request) {
  let body: FormattedExpense[] = await request.json();

  // TODO: Change this to a multiple-row insert
  for (let response of body) {
    await db
      .insertInto('transactions')
      .values({
        id: response.id,
        date: response.date,
        statementtype: response.statementType,
        expensetype: response.expenseType,
        vendor: response.vendor,
        price: response.price,
        location: response.location,
      })
      .execute();
  }

  return NextResponse.json(body);
}
