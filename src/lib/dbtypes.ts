import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import { ExpenseType, StatementType } from './apitypes';

export interface Database {
  transactions: TransactionsTable;
}

export interface TransactionsTable {
  id: Generated<number>;

  date: ColumnType<Date | string>;
  statementtype: string;
  expensetype: string;
  vendor: string;
  price: number;
  location: string;
}

export type Transaction = Selectable<TransactionsTable>;
export type NewTransaction = Insertable<TransactionsTable>;
export type UpdateTransaction = Updateable<TransactionsTable>;
