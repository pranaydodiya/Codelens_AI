/**
 * Application constants and configuration
 * This file re-exports mock data for backward compatibility
 * while keeping the mock data in a separate folder
 */

import {
  MOCK_STATS,
  MOCK_REPOSITORIES,
  MOCK_PULL_REQUESTS,
  MOCK_REVIEW_HISTORY,
  MOCK_AI_REVIEW,
  MOCK_CHART_DATA,
  MOCK_PRICING_PLANS,
  MOCK_SAMPLE_CODE,
  MOCK_CODE_FILES,
} from '@/mocks';

// Re-export for backward compatibility
export const STATS = MOCK_STATS;
export const REPOSITORIES = MOCK_REPOSITORIES;
export const PULL_REQUESTS = MOCK_PULL_REQUESTS;
export const REVIEW_HISTORY = MOCK_REVIEW_HISTORY;
export const AI_REVIEW = MOCK_AI_REVIEW;
export const CHART_DATA = MOCK_CHART_DATA;
export const PRICING_PLANS = MOCK_PRICING_PLANS;
export const SAMPLE_CODE = MOCK_SAMPLE_CODE;
export const CODE_FILES = MOCK_CODE_FILES;

// Navigation items - application config, not mock data
export const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Repositories', path: '/repositories', icon: 'GitBranch' },
  { name: 'Reviews', path: '/reviews', icon: 'Code' },
  { name: 'History', path: '/history', icon: 'History' },
  { name: 'Analytics', path: '/analytics', icon: 'BarChart3' },
  { name: 'AI Summary', path: '/ai-summary', icon: 'Sparkles' },
  { name: 'Code Generator', path: '/ai-generator', icon: 'Wand2' },
  { name: 'API Playground', path: '/api-playground', icon: 'Globe' },
  { name: 'Settings', path: '/settings', icon: 'Settings' },
];

// Application configuration
export const APP_CONFIG = {
  name: 'CodeLens',
  version: '1.0.0',
  supportEmail: 'support@codelens.ai',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxReviewsPerMonth: {
    free: 100,
    pro: 1000,
    enterprise: Infinity,
  },
};
