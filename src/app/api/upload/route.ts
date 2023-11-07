import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { BUCKET, EXPIRATION, UrlResponse } from '@/lib/api';

const s3Client = new S3Client({ region: 'us-west-2' });

export async function POST(request: Request) {
  const uploadRequest: UrlResponse = await request.json();

  if (!uploadRequest.key) {
    return NextResponse.json('Invalid upload key!', {
      status: StatusCodes.BAD_REQUEST,
    });
  }

  // Construct presigned urls for uploading and retrieving files
  // ChatGPT needs a static url to image files it recieves

  const uploadCommand = new PutObjectCommand({
    Bucket: BUCKET,
    Key: uploadRequest.key,
  });

  const getCommand = new GetObjectCommand({
    Bucket: BUCKET,
    Key: uploadRequest.key,
  });

  const getUrl = await getSignedUrl(s3Client, getCommand, {
    expiresIn: EXPIRATION,
  });
  const uploadUrl = await getSignedUrl(s3Client, uploadCommand, {
    expiresIn: EXPIRATION,
  });

  const res: UrlResponse = {
    bucket: BUCKET,
    key: uploadRequest.key,
    getUrl: getUrl,
    uploadUrl: uploadUrl,
    expires: EXPIRATION,
  };

  return NextResponse.json(res);
}
