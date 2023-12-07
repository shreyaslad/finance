import { BalancePOSTRequest } from '@/lib/api';
import { Database } from '@/lib/database';
import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';
import { v4 } from 'uuid';

const db = new Kysely<Database>({
  dialect: new PostgresJSDialect({
    postgres: postgres(process.env.POSTGRES_CONN_URL || ''),
  }),
});

export async function POST(request: NextRequest) {
  console.log('/api/balance');
  console.log(request);

  const balanceRequest: BalancePOSTRequest = await request.json();

  // TODO: change to batch insert
  for (let item of balanceRequest) {
    const res = await db
      .insertInto('balances')
      .values({
        id: v4(),
        timestamp: item.timestamp,
        statementtype: item.statementType,
        balance: item.balance,
      })
      .execute();

    // TODO check for errors inserting into db
  }

  return NextResponse.json(balanceRequest);
}
