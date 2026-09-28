import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = await getDb();
  return NextResponse.json(db.data.products);
}

export async function POST(req: Request) {
  const body = await req.json();
  const db = await getDb();
  const newProduct = { id: Date.now().toString(), ...body };
  db.data.products.push(newProduct);
  await db.write();
  return NextResponse.json(newProduct, { status: 201 });
}
