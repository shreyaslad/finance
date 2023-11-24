'use client';

import Link from 'next/link';
import { useAtom } from 'jotai';
import { uploadAtom } from '@/atoms/upload-atom';

import { Check, MoveLeft, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import UploadForm from '@/components/upload-form';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function ScanPage() {
  const [uploadData, _] = useAtom(uploadAtom);
  const [rawTextareaData, setRawTextareaData] = useState('');

  async function onSubmit() {
    await fetch(`/api/expense`, {
      method: 'POST',
      body: JSON.stringify(JSON.parse(rawTextareaData)),
    });
  }

  return (
    <div className="max-w-screen-sm m-8">
      <Link href={'/'}>
        <Button variant={'outline'} className="mb-4">
          <MoveLeft className="w-4 h-4 mr-2 text-muted-foreground" />
          <span className="font-semibold text-muted-foreground">Back</span>
        </Button>
      </Link>

      <div className="mb-4">
        <h2 className="text-3xl font-semibold tracking-tight scroll-m-20 first:mt-0">
          Scan Statement
        </h2>
        <p className="text-sm font-medium tracking-tight text-muted-foreground">
          Scan a bank or credit card statement
        </p>
      </div>

      <UploadForm />

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
            <Button variant={'outline'} className="w-1/4 mb-4">
              <X className="w-4 h-4 text-muted-foreground" />
              {/* <span className="text-muted-foreground">Cancel</span> */}
            </Button>
            <Button className="w-full" onClick={onSubmit}>
              <Check className="w-4 h-4 mr-2" />
              Yes, that looks right
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
