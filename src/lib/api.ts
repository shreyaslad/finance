export const BUCKET = 'finance-uploads-592951731404';
export const EXPIRATION = 3600;

export type UploadRequest = {
  name: string;
};

export type UrlResponse = {
  name: string;
  key: string;
  bucket: string;
  getUrl: string;
  uploadUrl: string;
  expires: number;
};

export type StatementType =
  | 'wf'
  | 'citi'
  | 'amex'
  | 'applesavings'
  | 'applecard'
  | 'fidelity';

export type ExpenseType =
  | 'shopping'
  | 'health'
  | 'food'
  | 'services'
  | 'travel'
  | 'payment';

export type FormattedExpense = {
  id: string;
  date: string;
  statementType: StatementType;
  expenseType: ExpenseType;
  vendor: string;
  price: number;
  location: string;
};

export type Balance = {
  id: string;

  timestamp: Date;
  statementType: StatementType;

  balance: number;
};

/* Extract Endpoint */

export type ExtractRequest = {
  file: UrlResponse;
  type: StatementType;
};

/* Expense Endpoint */

export type ExpenseGETResponse = {
  spending: number;
  transactions: FormattedExpense[];
};

export type ExpensePOSTRequest = {
  statementType: string;
  transactions: FormattedExpense[];
};

/* Balance Endpoint */

export type BalanceGETResponse = {
  total: number;
  balances: Balance[];
};

export type BalancePOSTRequest = Balance[];
