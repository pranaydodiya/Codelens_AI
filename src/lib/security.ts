/**
 * Security utilities for input validation and sanitization
 */

// List of allowed internal routes for redirect validation
const ALLOWED_INTERNAL_ROUTES = [
  '/dashboard',
  '/repositories',
  '/reviews',
  '/profile',
  '/team',
  '/history',
  '/analytics',
  '/billing',
  '/settings',
  '/ai-summary',
  '/ai-generator',
  '/api-playground',
  '/notifications',
  '/integrations',
  '/help',
  '/onboarding',
];

/**
 * Validates and sanitizes a redirect URL to prevent Open Redirect vulnerabilities
 * Only allows internal routes that start with '/' and are in the allowed list
 */
export function sanitizeRedirectUrl(url: string | undefined | null, defaultUrl: string = '/dashboard'): string {
  // If no URL provided, return default
  if (!url) {
    return defaultUrl;
  }

  // Trim whitespace
  const trimmedUrl = url.trim();

  // Must start with a single forward slash (not // which could be protocol-relative)
  if (!trimmedUrl.startsWith('/') || trimmedUrl.startsWith('//')) {
    return defaultUrl;
  }

  // Check for any protocol indicators that could lead to external redirects
  const lowerUrl = trimmedUrl.toLowerCase();
  if (
    lowerUrl.includes('javascript:') ||
    lowerUrl.includes('data:') ||
    lowerUrl.includes('vbscript:') ||
    lowerUrl.includes('@') || // Prevents user:pass@host attacks
    lowerUrl.includes('\\') // Prevents backslash-based bypasses
  ) {
    return defaultUrl;
  }

  // Extract the path without query params or hash
  const pathOnly = trimmedUrl.split('?')[0].split('#')[0];

  // Check if the path starts with an allowed route
  const isAllowed = ALLOWED_INTERNAL_ROUTES.some(route => 
    pathOnly === route || pathOnly.startsWith(route + '/')
  );

  if (!isAllowed) {
    return defaultUrl;
  }

  return trimmedUrl;
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates password strength
 */
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }
  return { valid: true };
}

/**
 * Sanitizes user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
