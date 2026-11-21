import { NextResponse } from 'next/server';

const NOT_IMPLEMENTED_MESSAGE =
  'User accounts are not supported. Use /api/profiles instead.';

export async function GET() {
  return NextResponse.json({ error: NOT_IMPLEMENTED_MESSAGE }, { status: 501 });
}

export async function POST() {
  return NextResponse.json({ error: NOT_IMPLEMENTED_MESSAGE }, { status: 501 });
}

export async function PUT() {
  return NextResponse.json({ error: NOT_IMPLEMENTED_MESSAGE }, { status: 501 });
}

export async function PATCH() {
  return NextResponse.json({ error: NOT_IMPLEMENTED_MESSAGE }, { status: 501 });
}

export async function DELETE() {
  return NextResponse.json({ error: NOT_IMPLEMENTED_MESSAGE }, { status: 501 });
}