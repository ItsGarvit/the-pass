import { User } from '../contexts/AuthContext';

/**
 * Check if a viewer can see a profile owner's profile picture
 * based on privacy settings and friend relationship
 */
export function canViewProfilePicture(
  viewer: User | null,
  profileOwner: User
): boolean {
  // No viewer (not logged in) - can only see public photos
  if (!viewer) {
    return profileOwner.photoPrivacy !== 'friends';
  }

  // Owner can always see their own picture
  if (viewer.id === profileOwner.id) {
    return true;
  }

  // Public pictures visible to all
  if (!profileOwner.photoPrivacy || profileOwner.photoPrivacy === 'public') {
    return true;
  }

  // Friends-only: check if viewer is a friend
  if (profileOwner.photoPrivacy === 'friends') {
    return profileOwner.friends?.includes(viewer.id) || false;
  }

  return false;
}

/**
 * Get the appropriate avatar source for display
 * Returns photoURL if visible, null if restricted
 */
export function getVisibleAvatarURL(
  viewer: User | null,
  profileOwner: User
): string | null {
  if (!profileOwner.photoURL) {
    return null;
  }

  return canViewProfilePicture(viewer, profileOwner) ? profileOwner.photoURL : null;
}
