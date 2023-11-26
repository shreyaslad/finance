import { atom } from 'jotai';
import { DateRange } from 'react-day-picker';

const firstDay = new Date();
const today = new Date();

firstDay.setDate(1);

export const dateRangeAtom = atom<DateRange | undefined>({
  from: firstDay,
  to: today,
});
