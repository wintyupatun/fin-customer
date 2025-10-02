import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Customer from '@/models/Customer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req, { params }) {
  await dbConnect();
  const c = await Customer.findById(params.id);
  if (!c) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(c);
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const body = await req.json();
    const updated = await Customer.findByIdAndUpdate(
      params.id,
      {
        name: body.name,
        dateOfBirth: new Date(body.dateOfBirth),
        memberNumber: body.memberNumber,
        interests: body.interests ?? ''
      },
      { new: true, runValidators: true }
    );
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req, { params }) {
  await dbConnect();
  const del = await Customer.findByIdAndDelete(params.id);
  if (!del) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}