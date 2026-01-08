/**
 * Clerk Authentication Utilities for Backend
 */

import { auth } from '@clerk/nextjs/server';

export interface AuthUser {
  userId: string;
  email?: string;
}

/**
 * Get authenticated user from Clerk
 * Returns null if not authenticated
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return null;
    }

    return {
      userId,
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

