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
 * Validates and sanitizes external URLs (for href attributes)
 * Only allows http:// and https:// protocols
 */
export function sanitizeExternalUrl(url: string | undefined | null): string | null {
  if (!url) {
    return null;
  }

  const trimmedUrl = url.trim();

  // Must start with http:// or https://
  if (!trimmedUrl.match(/^https?:\/\//i)) {
    return null;
  }

  // Check for dangerous protocols
  const lowerUrl = trimmedUrl.toLowerCase();
  if (
    lowerUrl.includes('javascript:') ||
    lowerUrl.includes('data:') ||
    lowerUrl.includes('vbscript:') ||
    lowerUrl.includes('file:')
  ) {
    return null;
  }

  // Validate URL format
  try {
    const urlObj = new URL(trimmedUrl);
    // Only allow http and https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return null;
    }
    return trimmedUrl;
  } catch {
    return null;
  }
}

/**
 * Validates GitHub username format (alphanumeric, hyphens, no spaces)
 */
export function sanitizeGitHubUsername(username: string | undefined | null): string | null {
  if (!username) {
    return null;
  }

  const trimmed = username.trim();
  // GitHub usernames: alphanumeric, hyphens, max 39 chars
  if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(trimmed)) {
    return null;
  }

  return trimmed;
}

/**
 * Validates Twitter/X username format
 */
export function sanitizeTwitterUsername(username: string | undefined | null): string | null {
  if (!username) {
    return null;
  }

  const trimmed = username.trim();
  // Twitter usernames: alphanumeric, underscores, max 15 chars
  if (!/^[a-zA-Z0-9_]{1,15}$/.test(trimmed)) {
    return null;
  }

  return trimmed;
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
  if (typeof input !== 'string') {
    return '';
  }
  return input
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;')
    .replaceAll('/', '&#x2F;');
}

/**
 * Validates JSON string format
 */
export function isValidJson(jsonString: string): boolean {
  if (!jsonString || typeof jsonString !== 'string') {
    return false;
  }
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitizes JSON input for API requests
 */
export function sanitizeJsonInput(input: string): string | null {
  if (!input || typeof input !== 'string') {
    return null;
  }
  
  const trimmed = input.trim();
  if (!isValidJson(trimmed)) {
    return null;
  }

  // Additional check: ensure it's an object or array
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }
    return trimmed;
  } catch {
    return null;
  }
}

/**
 * Validates API key format (basic validation)
 */
export function isValidApiKeyFormat(key: string): boolean {
  if (!key || typeof key !== 'string') {
    return false;
  }
  // Basic format check - adjust based on your API key format
  return key.length >= 10 && key.length <= 200 && /^[a-zA-Z0-9_-]+$/.test(key);
}

/**
 * Sanitizes CSS content for dangerouslySetInnerHTML
 * Only allows safe CSS properties and values
 */
export function sanitizeCssContent(css: string): string {
  if (typeof css !== 'string') {
    return '';
  }

  // Remove potentially dangerous CSS
  const dangerousPatterns = [
    /expression\s*\(/gi,
    /javascript\s*:/gi,
    /@import/gi,
    /behavior\s*:/gi,
    /binding\s*:/gi,
  ];

  let sanitized = css;
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replaceAll(pattern, '');
  });

  return sanitized;
}

/**
 * Validates and sanitizes file paths to prevent directory traversal
 */
export function sanitizeFilePath(filePath: string): string | null {
  if (!filePath || typeof filePath !== 'string') {
    return null;
  }

  // Remove directory traversal attempts
  if (filePath.includes('..') || filePath.includes('~')) {
    return null;
  }

  // Remove leading/trailing slashes and normalize (explicit grouping for precedence)
  const normalized = filePath.replaceAll(/(^\/+)|(\/+$)/g, '');

  // Check for dangerous characters: path separators and ASCII control characters (0x00-0x1F)
  if (/[<>:"|?*]/.test(normalized) || /[\x00-\x1F]/.test(normalized)) {
    return null;
  }

  return normalized;
}

/**
 * Rate limiting helper (client-side basic validation)
 * Note: Real rate limiting should be done server-side
 */
export function createRateLimiter(maxRequests: number, windowMs: number) {
  const requests: number[] = [];

  return () => {
    const now = Date.now();
    // Remove requests outside the time window
    while (requests.length > 0 && requests[0] < now - windowMs) {
      requests.shift();
    }

    if (requests.length >= maxRequests) {
      return false;
    }

    requests.push(now);
    return true;
  };
}

/**
 * CSRF Token management utilities
 * Note: CSRF tokens should be generated and validated server-side
 * This provides client-side helpers for token storage and retrieval
 */
export const CSRF_TOKEN_KEY = 'csrf-token';

export function getCsrfToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return sessionStorage.getItem(CSRF_TOKEN_KEY);
}

export function setCsrfToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  sessionStorage.setItem(CSRF_TOKEN_KEY, token);
}

export function removeCsrfToken(): void {
  if (typeof window === 'undefined') {
    return;
  }
  sessionStorage.removeItem(CSRF_TOKEN_KEY);
}

/**
 * Creates secure headers for API requests
 */
export function createSecureHeaders(csrfToken?: string | null): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };

  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  return headers;
}

/**
 * Validates request origin to prevent CSRF
 * Note: This is a client-side check. Server should validate origin header
 */
export function isValidOrigin(origin: string, allowedOrigins: string[]): boolean {
  try {
    const url = new URL(origin);
    return allowedOrigins.some(allowed => {
      try {
        const allowedUrl = new URL(allowed);
        return url.origin === allowedUrl.origin;
      } catch {
        return url.origin === allowed;
      }
    });
  } catch {
    return false;
  }
}
