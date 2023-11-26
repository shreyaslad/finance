import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import { ExpenseType, StatementType } from './api';

export interface Database {
  transactions: TransactionsTable;
}

/**
 * Transactions Table:
 *
 * Meant for aggregating credit / debit card transactions.
 */

export interface TransactionsTable {
  id: string;

  date: ColumnType<Date | string>;

  // These two are lowercase because neon.tech
  // forces lowercase column names
  statementtype: StatementType;
  expensetype: ExpenseType;

  vendor: string;
  price: number;
  location: string;
}

export type Transaction = Selectable<TransactionsTable>;
export type NewTransaction = Insertable<TransactionsTable>;
export type UpdateTransaction = Updateable<TransactionsTable>;

/**
 * Balances Table
 *
 * Point-in-time account balances. Balances for each account are just latest values,
 * not aggregated
 */

export interface BalancesTable {
  id: string;

  date: ColumnType<Date | string>;
  statementtype: StatementType;

  balance: number;
}

export type Balance = Selectable<BalancesTable>;
export type NewBalance = Insertable<BalancesTable>;
export type UpdateBalance = Updateable<BalancesTable>;
