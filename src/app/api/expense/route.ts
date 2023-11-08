import { ExpenseResponse } from '@/lib/apitypes';
import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_CONN_URL || '');

export async function GET(request: Request) {
  let expenseResponse: ExpenseResponse = {
    spending: '-1',
    transactions: [],
  };

  const totalSpending = await sql`SELECT SUM(price) from transactions;`;
  const transactions = await sql`SELECT * FROM transactions;`;
  console.log(transactions);

  expenseResponse.spending = totalSpending[0].sum.slice(0, -2);

  return NextResponse.json(expenseResponse);
}
