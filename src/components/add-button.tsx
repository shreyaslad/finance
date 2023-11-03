'use client';

import { PlusIcon } from 'lucide-react';

import { Button } from './ui/button';

import { useAtom } from 'jotai';
import { dialogOpenAtom } from '@/atoms/dialog-atom';

export default function AddButton() {
  const [_, setDialogOpen] = useAtom(dialogOpenAtom);

  return (
    <Button onClick={() => setDialogOpen(true)}>
      <PlusIcon className="w-4 h-4" />
    </Button>
  );
}
