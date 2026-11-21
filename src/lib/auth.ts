import { randomBytes, timingSafeEqual } from 'crypto';
import { db } from '@/lib/db';

/**
 * Profile access control.
 *
 * Each profile is anonymous and is protected by a secret access token that is
 * issued when the profile is created (POST /api/profiles) and stored on the
 * profile row. Every later call on that profile must present the token either as
 * `Authorization: Bearer <token>` (preferred) or as a `token` query parameter.
 *
 * Status mapping:
 *   400 - malformed profile id
 *   401 - no token presented
 *   403 - token presented but it does not match this profile
 *   404 - profile does not exist
 *   500 - database failure
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type AuthSuccess = { ok: true; profileId: string };
export type AuthFailure = {
  ok: false;
  status: 401 | 403 | 404 | 500;
  error: string;
};
export type AuthResult = AuthSuccess | AuthFailure;

/** Generates a new high-entropy secret access token for a profile. */
export function generateAccessToken(): string {
  return randomBytes(32).toString('base64url');
}

/** Reads the access token from the Authorization header, falling back to the `token` query parameter. */
export function extractAccessToken(request: Request): string | null {
  const header = request.headers.get('authorization');
  if (header) {
    const match = /^Bearer\s+(.+)$/i.exec(header.trim());
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  const queryToken = new URL(request.url).searchParams.get('token');
  return queryToken && queryToken.length > 0 ? queryToken : null;
}

/** Constant-time string comparison. */
function tokensMatch(presented: string, stored: string | null): boolean {
  if (!stored) return false;
  const a = Buffer.from(presented);
  const b = Buffer.from(stored);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Verifies that the request carries the access token belonging to the given profile.
 * Route handlers should return `{ error }` with `status` when `ok` is false.
 */
export async function authorizeProfile(
  request: Request,
  profileId: string,
): Promise<AuthResult> {
  if (!UUID_RE.test(profileId)) {
    return { ok: false, status: 404, error: 'Not found' };
  }

  const presented = extractAccessToken(request);
  if (!presented) {
    return { ok: false, status: 401, error: 'Missing access token' };
  }

  let profile: { id: string; accessToken: string | null } | null;
  try {
    profile = await db.profile.findUnique({
      where: { id: profileId },
      select: { id: true, accessToken: true },
    });
  } catch {
    return { ok: false, status: 500, error: 'Internal error' };
  }

  if (!profile) {
    return { ok: false, status: 404, error: 'Not found' };
  }

  if (!tokensMatch(presented, profile.accessToken)) {
    return { ok: false, status: 403, error: 'Access token does not match this profile' };
  }

  return { ok: true, profileId: profile.id };
}

/**
 * Issues a fresh access token for a profile and stores it on the profile row.
 * Returns the plaintext token so it can be sent back to the client once.
 */
export async function issueAccessToken(profileId: string): Promise<string> {
  const token = generateAccessToken();
  await db.profile.update({
    where: { id: profileId },
    data: { accessToken: token },
  });
  return token;
}