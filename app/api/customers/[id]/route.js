import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import Customer from "../../../../models/Customer";

// GET /api/customers/:id
export async function GET(_req, { params }) {
  await dbConnect();
  const doc = await Customer.findById(params.id);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

// PUT /api/customers/:id
export async function PUT(req, { params }) {
  await dbConnect();
  try {
    const body = await req.json();
    const update = {
      name: body.name,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
      memberNumber: Number(body.memberNumber) || 0,
      interests: body.interests ?? "",
    };
    const doc = await Customer.findByIdAndUpdate(params.id, update, { new: true });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc);
  } catch (err) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

// DELETE /api/customers/:id
export async function DELETE(_req, { params }) {
  await dbConnect();
  await Customer.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}


