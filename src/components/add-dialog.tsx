'use client';

import { useAtom } from 'jotai';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

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

// https://github.com/colinhacks/zod/issues/387#issuecomment-1191390673
const formSchema = z.object({
  statementType: z.string({
    required_error: 'Please select a statement type.',
  }),
  statementFile: z
    .custom<File[]>()
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files[0].type), {
      message: 'Allowed types: .jpg, .jpeg, .png and .webp',
    }),
});

export default function AddDialog() {
  const [dialogOpen, setDialogOpen] = useAtom(dialogOpenAtom);
  const [processing, setProcessing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log('Statement type: ' + data.statementType);
    console.log('File name: ' + data.statementFile[0].name);

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setDialogOpen(false);
    }, 5000);
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scan Statement</DialogTitle>
          <DialogDescription>
            Scan a bank or credit card statement
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="statementType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statement Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a source" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {statementTypes.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormDescription>
                    Choose a statement type from one of the sources above.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="statementFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Screenshot</FormLabel>
                  <Input
                    type="file"
                    // accept={ACCEPTED_IMAGE_TYPES.join(' ')}
                    {...form.register('statementFile', { required: true })}
                  />

                  <FormDescription>This is your statement.</FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={processing}>
              {processing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}

              <span>{processing ? 'Uploading' : 'Upload'}</span>
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
