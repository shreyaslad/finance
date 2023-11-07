import { UrlResponse } from '@/lib/api';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(request: Request) {
  const { getUrl }: UrlResponse = await request.json();
}
