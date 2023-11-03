'use client';

import { useState } from 'react';
import { signal } from '@preact/signals-react';
import { Check, ChevronsUpDown, PlusIcon } from 'lucide-react';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './ui/command';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { atom, useAtom } from 'jotai';
import { dialogOpenAtom } from '@/atoms/dialog-atom';

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

export default function AddButton() {
  const [_, setDialogOpen] = useAtom(dialogOpenAtom);

  return (
    <Button onClick={() => setDialogOpen(true)}>
      <PlusIcon className="w-4 h-4" />
    </Button>
  );
}
