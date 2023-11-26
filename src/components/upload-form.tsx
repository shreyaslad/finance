'use client';

import Link from 'next/link';
import { useState } from 'react';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { FormattedExpense, StatementType, UrlResponse } from '@/lib/api';
import { StatusCodes } from 'http-status-codes';
import { useAtom } from 'jotai';
import { uploadAtom } from '@/atoms/upload-atom';
import { useToast } from './ui/use-toast';

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const statementTypes = [
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

export default function UploadForm({
  setStatementType,
}: {
  setStatementType: (statmentType: StatementType) => void;
}) {
  const [processing, setProcessing] = useState(false);
  const [uploadData, setUploadData] = useAtom(uploadAtom);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const statementType = data.statementType;

    // Pass the selected statement type to the scan page
    setStatementType(statementType as StatementType);

    const file = data.statementFile[0];

    console.log('Statement type: ' + statementType);
    console.log('File name: ' + file.name);

    setProcessing(true);
    const urlResponse = await fetch(`/api/upload`, {
      method: 'POST',
      body: JSON.stringify({
        name: file.name,
      }),
    });

    // Attempt to upload the statement image to S3

    const urlJson: UrlResponse = await urlResponse.json();

    const uploadRes = await fetch(urlJson.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
      },
    });

    if (uploadRes.status == StatusCodes.OK) {
      console.log(`Sucessfully uploaded ${file.name}!`);
    } else {
      console.log(`Failed to upload ${file.name}`);
    }

    // Now attempt to extract transaction data from the file

    console.log('Extracting expense information from statement...');

    const expenseRes = await fetch('/api/extract', {
      method: 'POST',
      body: JSON.stringify({
        file: urlJson,
        type: statementType,
      }),
    });

    if (expenseRes.status != StatusCodes.OK) {
      toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description: 'Failed to parse JSON from expense reports.',
      });

      return;
    }

    console.log('Extracted expense information from statement');

    setProcessing(false);
    setUploadData((await expenseRes.json()) as FormattedExpense[]);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="statementType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statement Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

          <span>{processing ? 'Processing' : 'Process'}</span>
        </Button>
      </form>
    </Form>
  );
}
