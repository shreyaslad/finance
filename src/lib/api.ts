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
  | 'applecard';

export type ExpenseType =
  | 'shopping'
  | 'health'
  | 'food'
  | 'services'
  | 'travel'
  | 'payment';

export type FormattedExpense = {
  date: Date | undefined;
  statementType: StatementType | undefined;
  expenseType: ExpenseType | undefined;
  vendor: string | undefined;
  price: string | undefined;
  location: string | undefined;
};

export type ExpenseRequest = {
  file: UrlResponse;
  type: StatementType;
};
