
'use client';

import { useCallback, useEffect, useState } from 'react';
import { getProfileById } from '@/lib/api';
import type { Profile } from '@/types/profile';

const PROFILE_ID_KEY = 'kamgarsaathi.profileId';
const ACCESS_TOKEN_KEY = 'kamgarsaathi.accessToken';

function readStorage(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // Storage may be unavailable (private mode, quota). Fail silently.
  }
}

export function useLocalProfile() {
  const [profileId, setProfileIdState] = useState<string | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState<boolean>(false);

  // Read localStorage only after mount so server and client render the same HTML.
  useEffect(() => {
    setProfileIdState(readStorage(PROFILE_ID_KEY));
    setAccessTokenState(readStorage(ACCESS_TOKEN_KEY));
    setHydrated(true);
  }, []);

  const load = useCallback(async (id: string, token: string | null) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProfileById(id, token ? { token } : undefined);
      setProfile(data);
    } catch (err) {
      setProfile(null);
      setError(err instanceof Error ? err.message : 'Could not load profile');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!profileId) {
      setProfile(null);
      setError(null);
      setIsLoading(false);
      return;
    }
    void load(profileId, accessToken);
  }, [hydrated, profileId, accessToken, load]);

  const refetch = useCallback(async (): Promise<void> => {
    if (!profileId) return;
    await load(profileId, accessToken);
  }, [profileId, accessToken, load]);

  const saveProfileId = useCallback((id: string, token?: string | null) => {
    setProfileIdState(id);
    writeStorage(PROFILE_ID_KEY, id);
    if (token !== undefined) {
      setAccessTokenState(token);
      writeStorage(ACCESS_TOKEN_KEY, token);
    }
  }, []);

  const clearProfile = useCallback(() => {
    setProfileIdState(null);
    setAccessTokenState(null);
    setProfile(null);
    setError(null);
    writeStorage(PROFILE_ID_KEY, null);
    writeStorage(ACCESS_TOKEN_KEY, null);
  }, []);

  return {
    profileId,
    accessToken,
    profile,
    isLoading,
    error,
    refetch,
    saveProfileId,
    clearProfile,
  };
}