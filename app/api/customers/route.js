import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import Customer from "../../../models/Customer";

// GET /api/customers
export async function GET() {
  await dbConnect();
  const docs = await Customer.find({}).sort({ createdAt: -1 });
  return NextResponse.json(docs);
}

// POST /api/customers
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const doc = await Customer.create({
      name: body.name,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
      memberNumber: Number(body.memberNumber) || 0,
      interests: body.interests ?? "",
    });
    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}


