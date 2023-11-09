import { ExpenseResponse, FormattedExpense } from '@/lib/apitypes';
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
  let expenseResponse: ExpenseResponse = {
    spending: 0,
    transactions: [],
  };

  // const totalSpending = await sql`SELECT SUM(price) from transactions;`;
  // const transactions = await sql`SELECT * FROM transactions;`;
  // console.log(transactions);

  // expenseResponse.spending = totalSpending[0].sum.slice(0, -2);

  const totalSpending = await db
    .selectFrom('transactions')
    .select(({ fn }) => [fn.sum<number>('transactions.price').as('totalPrice')])
    .execute();

  const transactions = await db
    .selectFrom('transactions')
    .selectAll()
    .execute();

  expenseResponse.spending = Number(totalSpending[0].totalPrice);

  for (let transaction of transactions) {
    expenseResponse.transactions.push({
      id: transaction.id,
      date: transaction.date,
      statementType: transaction.statementType,
      expenseType: transaction.expenseType,
      vendor: transaction.vendor,
      price: transaction.price,
      location: transaction.location,
    });
  }

  return NextResponse.json(expenseResponse);
}
