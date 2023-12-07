'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation';

import { uploadAtom } from '@/atoms/upload-atom';

import { Check, Loader2, MoveLeft, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import UploadForm from '@/components/upload-form';
import { Textarea } from '@/components/ui/textarea';
import { StatusCodes } from 'http-status-codes';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
import { z } from 'zod';

import { StatementType } from '@/lib/api';
import { StatementMappings } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function ScanPage() {
  const [uploadData, _] = useAtom(uploadAtom);
  const [rawTextareaData, setRawTextareaData] = useState('');
  const [statementType, setStatementType] = useState<StatementType>();

  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function onSubmit() {
    setProcessing(true);

    const res = await fetch(`/api/expense`, {
      method: 'POST',
      body: JSON.stringify({
        statementType: statementType,
        transactions: JSON.parse(rawTextareaData),
      }),
    });

    setProcessing(false);

    if (res.status == StatusCodes.OK) {
      router.push('/');
    } else {
      toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description: 'Failed to parse JSON or insert into DB',
      });
    }
  }

  return (
    <div className="p-6 border rounded-lg border-muted">
      <div className="mb-4">
        <h2 className="text-3xl font-semibold tracking-tight scroll-m-20 first:mt-0">
          Scan Statement
        </h2>
        <p className="text-sm font-medium text-muted-foreground">
          Scan a bank or credit card statement
        </p>
      </div>

      <UploadForm setStatementType={setStatementType} />

      {uploadData.length > 0 ? (
        <div className="flex flex-col mt-4 gap-y-4">
          <hr className="h-[2px] border-0 bg-muted" />
          <h3 className="text-2xl font-semibold tracking-tight text-secondary-foreground scroll-m-20">
            Your Expenses
          </h3>

          <Textarea
            cols={100}
            rows={20}
            onChange={(e) => setRawTextareaData(e.target.value)}
            defaultValue={JSON.stringify(uploadData, null, 2)}
            contentEditable={true}
          />

          <div className="flex flex-row gap-x-2">
            <Button
              variant={'outline'}
              className="w-1/4 mb-4"
              onClick={() => router.push('/')}
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button className="w-full" onClick={onSubmit}>
              {processing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Yes, that looks right
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BalancePage() {
  const formSchema = z.object({
    statementType: z.string({
      required_error: 'Please select a statement type.',
    }),
    balance: z.coerce.number({
      required_error: 'Balance is required',
      invalid_type_error: 'Balance must be a number',
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  return (
    <div className="p-6 border rounded-lg border-muted">
      <div className="mb-4">
        <h2 className="text-3xl font-semibold tracking-tight scroll-m-20 first:mt-0">
          Record Balance
        </h2>
        <p className="text-sm font-medium text-muted-foreground">
          Update the current balance for one or more of your accounts
        </p>
      </div>

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
                    {StatementMappings.map((item) => (
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
            name="balance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Balance</FormLabel>
                <div className="flex flex-row items-center">
                  <p className="mr-2 text-muted-foreground">$</p>
                  <Input
                    placeholder="0.00"
                    {...form.register('balance', { required: true })}
                  />
                </div>

                <FormDescription>
                  Enter the balance of the selected bank account.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export default function NewPage() {
  return (
    <div className="flex flex-col max-w-screen-sm m-8 gap-y-4">
      <Link href={'/'}>
        <Button variant={'outline'} className="mb-4">
          <MoveLeft className="w-4 h-4 mr-2 text-muted-foreground" />
          <span className="font-semibold text-muted-foreground">Back</span>
        </Button>
      </Link>

      <Tabs defaultValue="scan">
        <TabsList className="mb-4">
          <TabsTrigger value="scan">Scan Statement</TabsTrigger>
          <TabsTrigger value="balance">Record Balance</TabsTrigger>
        </TabsList>

        <TabsContent value="scan">
          <ScanPage />
        </TabsContent>

        <TabsContent value="balance">
          <BalancePage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
