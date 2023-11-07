export const BUCKET = 'finance-uploads-592951731404';
export const EXPIRATION = 3600;

export const statementTypes = [
  {
    value: 'wf',
    label: 'Wells Fargo',
  },
  {
    value: 'citi',
    label: 'CitiBank',
  },
  {
    value: 'amex',
    label: 'Amex',
  },
  {
    value: 'applesavings',
    label: 'Apple Savings',
  },
  {
    value: 'applecard',
    label: 'Apple Card',
  },
];

export type UrlResponse = {
  bucket: string;
  key: string;
  getUrl: string;
  uploadUrl: string;
  expires: number;
};

export type ExpenseRequest = {
  file: UrlResponse;
  type: 'wf' | 'citi' | 'amex' | 'applesavings' | 'applecard';
};
