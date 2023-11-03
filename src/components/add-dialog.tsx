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

        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
