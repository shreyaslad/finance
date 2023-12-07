import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
