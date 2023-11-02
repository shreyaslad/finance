'use client';

import { PlusIcon } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

export default function AddButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scan Statement</DialogTitle>
          <DialogContent>
            <DialogHeader>Select a document</DialogHeader>
            <DialogDescription>This is a description</DialogDescription>
          </DialogContent>
        </DialogHeader>
        <DialogFooter>
          <Button>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
