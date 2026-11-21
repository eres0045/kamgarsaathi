import { NextResponse } from 'next/server';

// Stub: this app has no user accounts (see PRD data model), so there is no user to read or change.
// Every method answers 501 Not Implemented for any id.

function notImplemented() {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}

export async function GET(_request: Request) {
  return notImplemented();
}

export async function POST(_request: Request) {
  return notImplemented();
}

export async function PUT(_request: Request) {
  return notImplemented();
}

export async function PATCH(_request: Request) {
  return notImplemented();
}

export async function DELETE(_request: Request) {
  return notImplemented();
}