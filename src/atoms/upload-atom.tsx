import { FormattedExpense, StatementType } from '@/lib/apitypes';
import { atom } from 'jotai';

export const uploadAtom = atom<FormattedExpense[]>([]);
