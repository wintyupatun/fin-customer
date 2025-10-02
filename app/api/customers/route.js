import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Customer from '@/models/Customer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();
  const all = await Customer.find().sort({ createdAt: -1 });
  return NextResponse.json(all);
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const created = await Customer.create({
      name: body.name,
      dateOfBirth: new Date(body.dateOfBirth),
      memberNumber: body.memberNumber,
      interests: body.interests ?? ''
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}