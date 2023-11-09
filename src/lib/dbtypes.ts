import { Generated, Insertable, Selectable, Updateable } from 'kysely';
import { ExpenseType, StatementType } from './apitypes';

export interface Database {
  transactions: TransactionsTable;
}

export interface TransactionsTable {
  id: Generated<number>;

  date: Date;
  statementType: StatementType;
  expenseType: ExpenseType;
  vendor: string;
  price: number;
  location: string;
}

export type Transaction = Selectable<TransactionsTable>;
export type NewTransaction = Insertable<TransactionsTable>;
export type UpdateTransaction = Updateable<TransactionsTable>;
