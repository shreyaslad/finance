import {
  ExpensePOSTRequest,
  ExpenseGETResponse,
  ExpenseType,
  FormattedExpense,
  StatementType,
} from '@/lib/api';
import { Database } from '@/lib/database';
import { PostgresJSDialect } from 'kysely-postgres-js';
import { Kysely, PostgresDialect } from 'kysely';
import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

const db = new Kysely<Database>({
  dialect: new PostgresJSDialect({
    postgres: postgres(process.env.POSTGRES_CONN_URL || ''),
  }),
});

export async function GET(request: NextRequest) {
  console.log('/api/expense');
  console.log(request);

  const searchParams = request.nextUrl.searchParams;
  const start = new Date(searchParams.get('start') || '1/1/1970');
  const end = new Date(searchParams.get('end') || '1/1/2030');

  let expenseResponse: ExpenseGETResponse = {
    spending: 0,
    transactions: [],
  };

  // TODO: restrice total summation to selected dates
  const totalSpending = await db
    .selectFrom('transactions')
    .select(({ fn }) => [fn.sum<number>('transactions.price').as('totalPrice')])
    .execute();

  const transactions = await db
    .selectFrom('transactions')
    .selectAll()
    .where('date', '>=', start)
    .where('date', '<=', end)
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
  let body: ExpensePOSTRequest = await request.json();

  let statementType = body.statementType;
  let transactions = body.transactions;

  // TODO: Change this to a multiple-row insert
  for (let response of transactions) {
    await db
      .insertInto('transactions')
      .values({
        id: response.id,
        date: response.date,
        statementtype: statementType as StatementType,
        expensetype: response.expenseType as ExpenseType,
        vendor: response.vendor,
        price: response.price,
        location: response.location,
      })
      .execute();
  }

  return NextResponse.json(body);
}
