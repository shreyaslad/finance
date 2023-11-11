'use client';

import Link from 'next/link';
import { useAtom } from 'jotai';
import { uploadAtom } from '@/atoms/upload-atom';

import { MoveLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import UploadForm from '@/components/upload-form';
import { Table } from '@/components/ui/table';

export default function ScanPage() {
  const [uploadData, setUploadData] = useAtom(uploadAtom);

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
        <p className="text-sm font-medium text-muted-foreground">
          Scan a bank or credit card statement
        </p>
      </div>

      <UploadForm />

      {uploadData.length > 0 ? <p>Got data</p> : null}
    </div>
  );
}
