import { FormattedExpense, StatementType } from '@/lib/api';
import { atom } from 'jotai';

export const uploadAtom = atom<FormattedExpense[]>([]);
