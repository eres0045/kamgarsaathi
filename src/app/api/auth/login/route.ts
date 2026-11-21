import { NextResponse } from 'next/server';

// KamgarSaathi has no login and no user accounts (PRD: data model).
// This endpoint is a stub so the route exists and fails clearly.
export async function POST() {
  return NextResponse.json(
    { error: 'Login is not available. This app has no user accounts.' },
    { status: 501 },
  );
}