import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';

const s3Client = new S3Client({ region: 'us-west-2' });
const EXPIRATION = 3600;

export async function POST(request: Request) {
  const { name } = await request.json();

  if (!name) {
    return NextResponse.json('Invalid upload key!', {
      status: StatusCodes.BAD_REQUEST,
    });
  }

  const command = new PutObjectCommand({
    Bucket: 'finance-uploads-592951731404',
    Key: name,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: EXPIRATION });

  return NextResponse.json({ url: url, expires: EXPIRATION });
}
