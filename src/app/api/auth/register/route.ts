
import { NextResponse } from 'next/server';

// KamgarSaathi has no user accounts (profiles are anonymous and use an access token),
// so registration is not implemented. This stub keeps the endpoint path reserved.
export async function POST() {
  return NextResponse.json(
    { error: 'Registration is not available: this app has no user accounts' },
    { status: 501 }
  );
}