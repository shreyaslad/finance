'use client';

import { useAtom } from 'jotai';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { dialogOpenAtom } from '@/atoms/dialog-atom';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Input } from './ui/input';

const statementTypes = [
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

export default function AddDialog() {
  const [dialogOpen, setDialogOpen] = useAtom(dialogOpenAtom);
  const [processing, setProcessing] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scan Statement</DialogTitle>
          <DialogDescription>
            Scan a bank or credit card statement
          </DialogDescription>
        </DialogHeader>

        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a source" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {/* <SelectLabel>Sources</SelectLabel> */}
              {statementTypes.map((item) => (
                <SelectItem value={item.value}>{item.label}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Input type="file" />

        <Button
          onClick={() => {
            setProcessing(true);
            setTimeout(() => {
              setProcessing(false);
              setDialogOpen(false);
            }, 5000);
          }}
          disabled={processing}
        >
          {processing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : null}

          <span>{processing ? 'Uploading' : 'Upload'}</span>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
