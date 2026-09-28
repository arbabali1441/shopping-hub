import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { getDb } from '@/lib/db';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-1.5-flash'),
    system: 'Aap ek helpful E-Commerce Assistant hain. Store ke products search karke exact details aur price user ko batayein.',
    messages,
    tools: {
      searchStoreProducts: tool({
        description: 'Local db.json se products search karne ke liye',
        parameters: z.object({
          query: z.string().describe('Search keyword e.g. chair, table, sofa'),
        }),
        execute: async ({ query }) => {
          const db = await getDb();
          const items = db.data.products.filter(
            p => p.title.toLowerCase().includes(query.toLowerCase()) || 
                 p.category.toLowerCase().includes(query.toLowerCase())
          );
          return items.length > 0 ? items : "Koi matching product nahi mila.";
        },
      }),
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
