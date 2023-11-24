import { FormattedExpense } from '@/lib/apitypes';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';

export const transactionsColumns: ColumnDef<FormattedExpense>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date: string = row.getValue('date');

      return (
        <div className="font-medium">
          {moment(date).utc(false).format('MM/DD/YYYY')}
        </div>
      );
    },
  },
  {
    accessorKey: 'vendor',
    header: 'Vendor',
  },
  {
    accessorKey: 'statementType',
    header: 'Method',
  },
  {
    accessorKey: 'expenseType',
    header: 'Expense',
  },
  {
    accessorKey: 'price',
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="text-right">{formatted}</div>;
    },
  },
];
