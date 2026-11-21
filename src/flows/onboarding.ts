import {
  createPersonaProfile,
  createProfile,
  createProfileConfirm,
  createProfileSuggestion,
  getProfileById,
  updateProfile,
} from '@/lib/api';
import type { Profile } from '@/types/profile';

export type OnboardingStep = 'entry' | 'story' | 'review' | 'confirm' | 'done';

export const ONBOARDING_STEPS: readonly OnboardingStep[] = [
  'entry',
  'story',
  'review',
  'confirm',
  'done',
];

export type ProfileSuggestion = Awaited<ReturnType<typeof createProfileSuggestion>>;

export type OnboardingAuth = { token?: string };

export type ProfileEdits = Partial<Omit<Profile, 'createdAt' | 'deletedAt' | 'id' | 'updatedAt'>>;

/** Fields the server requires before it will confirm a profile. */
const REQUIRED_CONFIRM_FIELDS = ['age', 'occupation', 'state'] as const;

export function nextStep(step: OnboardingStep): OnboardingStep {
  const index = ONBOARDING_STEPS.indexOf(step);
  if (index < 0 || index >= ONBOARDING_STEPS.length - 1) {
    return step;
  }
  return ONBOARDING_STEPS[index + 1];
}

export function previousStep(step: OnboardingStep): OnboardingStep {
  const index = ONBOARDING_STEPS.indexOf(step);
  if (index <= 0) {
    return step;
  }
  return ONBOARDING_STEPS[index - 1];
}

export function missingConfirmFields(
  profile: Partial<Profile> | null | undefined,
): string[] {
  if (!profile) {
    return [...REQUIRED_CONFIRM_FIELDS];
  }
  const missing: string[] = [];
  const age = profile.age;
  if (typeof age !== 'number' || !Number.isFinite(age) || age <= 0) {
    missing.push('age');
  }
  if (typeof profile.occupation !== 'string' || profile.occupation.trim() === '') {
    missing.push('occupation');
  }
  if (typeof profile.state !== 'string' || profile.state.trim() === '') {
    missing.push('state');
  }
  return missing;
}

export function canConfirmProfile(profile: Partial<Profile> | null | undefined): boolean {
  return missingConfirmFields(profile).length === 0;
}

/** Decides which screen a returning user should land on. */
export function resolveResumeStep(profile: Partial<Profile> | null | undefined): OnboardingStep {
  if (!profile) {
    return 'entry';
  }
  if (profile.isConfirmed) {
    return 'done';
  }
  if (canConfirmProfile(profile)) {
    return 'confirm';
  }
  if (profile.storyText && profile.storyText.trim() !== '') {
    return 'review';
  }
  return 'story';
}

export async function suggestFromStory(storyText: string): Promise<ProfileSuggestion> {
  return createProfileSuggestion({ story_text: storyText.trim() });
}

export async function startFromStory(storyText: string): Promise<Profile> {
  const { profile } = await createProfile({ storyText: storyText.trim(), source: 'typed_story' });
  return profile;
}

export async function startFromPersona(personaId: string): Promise<Profile> {
  return createPersonaProfile(personaId, {});
}

export async function loadOnboardingProfile(
  profileId: string,
  auth: OnboardingAuth = {},
): Promise<Profile> {
  return getProfileById(profileId, { token: auth.token });
}

export async function saveProfileEdits(
  profileId: string,
  edits: ProfileEdits,
): Promise<Profile> {
  return updateProfile(profileId, edits);
}

/**
 * Confirms the profile only after the required fields are present locally.
 * The server enforces the same rule; this check avoids a round trip
 * and lets the UI show which fields are still missing.
 */
export async function confirmOnboardingProfile(
  profileId: string,
  auth: OnboardingAuth = {},
): Promise<Profile> {
  const current = await getProfileById(profileId, { token: auth.token });
  const missing = missingConfirmFields(current);
  if (missing.length > 0) {
    throw new Error(`Profile is missing required fields: ${missing.join(', ')}`);
  }
  return createProfileConfirm(profileId, {});
}