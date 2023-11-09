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
  id: number | -1;
  date: Date;
  statementType: StatementType;
  expenseType: ExpenseType | 'shopping';
  vendor: string | '';
  price: number | 0;
  location: string | '';
};

export type ExtractRequest = {
  file: UrlResponse;
  type: StatementType;
};

export type ExpenseResponse = {
  spending: number;
  transactions: FormattedExpense[];
};
