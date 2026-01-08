/**
 * GitHub OAuth Utilities
 */

import crypto from 'node:crypto';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/api/github/callback';

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  console.warn('GitHub OAuth credentials not configured. GitHub integration will not work.');
}

/**
 * Generate OAuth state parameter for CSRF protection
 */
export function generateState(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate GitHub OAuth authorization URL
 */
export function getGitHubAuthUrl(state: string, scopes: string[] = ['repo', 'read:user']): string {
  if (!GITHUB_CLIENT_ID) {
    throw new Error('GITHUB_CLIENT_ID is not configured');
  }

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_CALLBACK_URL,
    scope: scopes.join(' '),
    state: state,
    response_type: 'code',
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(code: string): Promise<string> {
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    throw new Error('GitHub OAuth credentials not configured');
  }

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code: code,
      redirect_uri: GITHUB_CALLBACK_URL,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error_description || data.error);
  }

  return data.access_token;
}

/**
 * Encrypt token for storage (simple encryption - use proper encryption in production)
 */
export function encryptToken(token: string): string {
  // In production, use proper encryption with a key management service
  // For now, we'll store it as-is but mark it for encryption
  const algorithm = 'aes-256-gcm';
  const key = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
  
  // Simple base64 encoding for now - replace with proper encryption
  return Buffer.from(token).toString('base64');
}

/**
 * Decrypt token from storage
 */
export function decryptToken(encryptedToken: string): string {
  // Decode from base64
  return Buffer.from(encryptedToken, 'base64').toString('utf-8');
}

/**
 * Validate state parameter (CSRF protection)
 */
export function validateState(state: string, storedState: string): boolean {
  return state === storedState && state.length > 0;
}

