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
  DialogTrigger,
  DialogClose,
} from './ui/dialog';
import { dialogOpenAtom } from '@/atoms/dialog-atom';

export default function AddDialog() {
  const [dialogOpen, setDialogOpen] = useAtom(dialogOpenAtom);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scan Statement</DialogTitle>
          <DialogDescription>
            Scan a bank or credit card statement
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={() => {}}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
