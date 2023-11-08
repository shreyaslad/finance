import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { BUCKET, EXPIRATION, UrlResponse } from '@/lib/apitypes';
import { randomUUID } from 'crypto';

const s3Client = new S3Client({ region: 'us-west-2' });

export async function POST(request: Request) {
  const uploadRequest: UrlResponse = await request.json();

  const randomKey = randomUUID();

  // Construct presigned urls for uploading and retrieving files
  // ChatGPT needs a static url to image files it recieves

  const uploadCommand = new PutObjectCommand({
    Bucket: BUCKET,
    Key: randomKey,
  });

  const getCommand = new GetObjectCommand({
    Bucket: BUCKET,
    Key: randomKey,
  });

  const getUrl = await getSignedUrl(s3Client, getCommand, {
    expiresIn: EXPIRATION,
  });
  const uploadUrl = await getSignedUrl(s3Client, uploadCommand, {
    expiresIn: EXPIRATION,
  });

  const res: UrlResponse = {
    name: uploadRequest.name,
    key: randomKey,
    bucket: BUCKET,
    getUrl: getUrl,
    uploadUrl: uploadUrl,
    expires: EXPIRATION,
  };

  return NextResponse.json(res);
}
