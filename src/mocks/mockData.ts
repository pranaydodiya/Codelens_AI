/**
 * Mock data for demo/development purposes
 * This file centralizes all mock data for easy management
 * In production, this data would come from the database
 */

// ============================================
// STATISTICS
// ============================================
export const MOCK_STATS = {
  connectedRepos: 24,
  pullRequestsReviewed: 1847,
  aiReviewsGenerated: 3291,
  successRate: 94.2,
  avgReviewTime: '2.3 min',
  issuesFound: 12453,
};

// ============================================
// REPOSITORIES
// ============================================
export interface MockRepository {
  id: string;
  name: string;
  fullName: string;
  language: string;
  stars: number;
  lastScan: string;
  status: 'connected' | 'pending' | 'error';
  prs: number;
  reviewedPrs: number;
  description?: string;
  isPrivate?: boolean;
  forks?: number;
}

export const MOCK_REPOSITORIES: MockRepository[] = [
  {
    id: '1',
    name: 'frontend-app',
    fullName: 'acme-corp/frontend-app',
    language: 'TypeScript',
    stars: 234,
    lastScan: '2 hours ago',
    status: 'connected',
    prs: 12,
    reviewedPrs: 145,
    description: 'Modern React frontend application',
    isPrivate: false,
    forks: 45,
  },
  {
    id: '2',
    name: 'api-gateway',
    fullName: 'acme-corp/api-gateway',
    language: 'Go',
    stars: 89,
    lastScan: '5 hours ago',
    status: 'connected',
    prs: 8,
    reviewedPrs: 98,
    description: 'API Gateway service',
    isPrivate: true,
    forks: 12,
  },
  {
    id: '3',
    name: 'ml-pipeline',
    fullName: 'acme-corp/ml-pipeline',
    language: 'Python',
    stars: 156,
    lastScan: '1 day ago',
    status: 'connected',
    prs: 5,
    reviewedPrs: 67,
    description: 'Machine learning data pipeline',
    isPrivate: false,
    forks: 23,
  },
  {
    id: '4',
    name: 'mobile-sdk',
    fullName: 'acme-corp/mobile-sdk',
    language: 'Swift',
    stars: 445,
    lastScan: '3 hours ago',
    status: 'pending',
    prs: 23,
    reviewedPrs: 312,
    description: 'Cross-platform mobile SDK',
    isPrivate: false,
    forks: 67,
  },
  {
    id: '5',
    name: 'design-system',
    fullName: 'acme-corp/design-system',
    language: 'TypeScript',
    stars: 678,
    lastScan: '30 minutes ago',
    status: 'connected',
    prs: 4,
    reviewedPrs: 89,
    description: 'Shared component library',
    isPrivate: false,
    forks: 89,
  },
  {
    id: '6',
    name: 'data-warehouse',
    fullName: 'acme-corp/data-warehouse',
    language: 'SQL',
    stars: 45,
    lastScan: '2 days ago',
    status: 'error',
    prs: 2,
    reviewedPrs: 23,
    description: 'Data warehouse and analytics',
    isPrivate: true,
    forks: 5,
  },
];

// ============================================
// PULL REQUESTS
// ============================================
export interface MockPullRequest {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  status: 'reviewed' | 'pending' | 'failed';
  aiScore: number | null;
  createdAt: string;
  files: number;
  additions: number;
  deletions: number;
}

export const MOCK_PULL_REQUESTS: MockPullRequest[] = [
  {
    id: 'PR-1234',
    title: 'feat: Add user authentication with OAuth2',
    author: 'sarah.chen',
    authorAvatar: 'SC',
    status: 'reviewed',
    aiScore: 92,
    createdAt: '2 hours ago',
    files: 12,
    additions: 456,
    deletions: 23,
  },
  {
    id: 'PR-1233',
    title: 'fix: Resolve memory leak in connection pool',
    author: 'mike.johnson',
    authorAvatar: 'MJ',
    status: 'pending',
    aiScore: null,
    createdAt: '4 hours ago',
    files: 3,
    additions: 45,
    deletions: 12,
  },
  {
    id: 'PR-1232',
    title: 'refactor: Migrate to new state management',
    author: 'alex.kim',
    authorAvatar: 'AK',
    status: 'reviewed',
    aiScore: 78,
    createdAt: '1 day ago',
    files: 28,
    additions: 1234,
    deletions: 567,
  },
  {
    id: 'PR-1231',
    title: 'docs: Update API documentation',
    author: 'emma.wilson',
    authorAvatar: 'EW',
    status: 'reviewed',
    aiScore: 95,
    createdAt: '1 day ago',
    files: 5,
    additions: 234,
    deletions: 45,
  },
  {
    id: 'PR-1230',
    title: 'perf: Optimize database queries for reports',
    author: 'david.lee',
    authorAvatar: 'DL',
    status: 'failed',
    aiScore: 45,
    createdAt: '2 days ago',
    files: 8,
    additions: 89,
    deletions: 156,
  },
];

// ============================================
// REVIEW HISTORY
// ============================================
export interface MockReviewHistory {
  id: string;
  prTitle: string;
  repo: string;
  status: 'completed' | 'pending' | 'failed';
  score: number | null;
  timestamp: string;
  issuesFound: number;
  suggestionsAccepted: number;
}

export const MOCK_REVIEW_HISTORY: MockReviewHistory[] = [
  {
    id: 'REV-001',
    prTitle: 'feat: Add user authentication with OAuth2',
    repo: 'frontend-app',
    status: 'completed',
    score: 92,
    timestamp: '2024-01-15 14:32',
    issuesFound: 3,
    suggestionsAccepted: 2,
  },
  {
    id: 'REV-002',
    prTitle: 'refactor: Migrate to new state management',
    repo: 'frontend-app',
    status: 'completed',
    score: 78,
    timestamp: '2024-01-15 10:15',
    issuesFound: 8,
    suggestionsAccepted: 6,
  },
  {
    id: 'REV-003',
    prTitle: 'fix: Resolve memory leak in connection pool',
    repo: 'api-gateway',
    status: 'pending',
    score: null,
    timestamp: '2024-01-15 09:45',
    issuesFound: 0,
    suggestionsAccepted: 0,
  },
  {
    id: 'REV-004',
    prTitle: 'perf: Optimize database queries for reports',
    repo: 'data-warehouse',
    status: 'failed',
    score: 45,
    timestamp: '2024-01-14 16:22',
    issuesFound: 12,
    suggestionsAccepted: 4,
  },
];

// ============================================
// AI REVIEW DATA
// ============================================
export const MOCK_AI_REVIEW = {
  summary: "This pull request introduces OAuth2 authentication with well-structured code. The implementation follows security best practices with proper token handling and refresh mechanisms. Minor improvements suggested for error handling and test coverage.",
  strengths: [
    "Clean separation of authentication logic into dedicated modules",
    "Comprehensive token refresh mechanism with proper expiry handling",
    "Good use of TypeScript types for auth state management",
    "Follows OAuth2 security best practices (PKCE flow)",
  ],
  issues: [
    {
      severity: 'warning' as const,
      title: "Missing error boundary for auth failures",
      description: "Consider adding a dedicated error boundary component to gracefully handle authentication failures.",
      file: "src/auth/AuthProvider.tsx",
      line: 45,
    },
    {
      severity: 'error' as const,
      title: "Potential token exposure in console logs",
      description: "Remove console.log statements that may expose sensitive token data in production.",
      file: "src/auth/tokenManager.ts",
      line: 23,
    },
    {
      severity: 'info' as const,
      title: "Consider using secure storage",
      description: "For enhanced security, consider using secure storage mechanisms instead of localStorage for tokens.",
      file: "src/auth/storage.ts",
      line: 12,
    },
  ],
  suggestions: [
    "Add unit tests for token refresh edge cases",
    "Implement rate limiting for auth endpoints",
    "Add telemetry for auth success/failure metrics",
    "Consider implementing silent refresh for better UX",
  ],
  improvements: [
    {
      type: 'performance',
      description: "Cache decoded JWT claims to avoid repeated parsing",
    },
    {
      type: 'security',
      description: "Implement CSRF protection for auth endpoints",
    },
    {
      type: 'maintainability',
      description: "Extract magic numbers into named constants",
    },
  ],
  confidence: 92,
  reviewTime: '2.3 seconds',
  aiPoem: `In the realm of code so bright,
OAuth flows with cryptic might,
Tokens dance from server to client,
Security measures, ever compliant.

Yet in the depths of logic's maze,
A console.log gives us pause,
Remove it quick, lest secrets leak,
The security we proudly seek.`,
};

// ============================================
// CHART DATA
// ============================================
export const MOCK_CHART_DATA = {
  prActivity: [
    { date: 'Jan 1', prs: 12, reviews: 10 },
    { date: 'Jan 2', prs: 19, reviews: 18 },
    { date: 'Jan 3', prs: 15, reviews: 14 },
    { date: 'Jan 4', prs: 25, reviews: 23 },
    { date: 'Jan 5', prs: 22, reviews: 20 },
    { date: 'Jan 6', prs: 8, reviews: 8 },
    { date: 'Jan 7', prs: 5, reviews: 5 },
    { date: 'Jan 8', prs: 18, reviews: 17 },
    { date: 'Jan 9', prs: 24, reviews: 22 },
    { date: 'Jan 10', prs: 28, reviews: 26 },
    { date: 'Jan 11', prs: 21, reviews: 19 },
    { date: 'Jan 12', prs: 16, reviews: 15 },
  ],
  monthlyTrends: [
    { month: 'Aug', reviews: 234 },
    { month: 'Sep', reviews: 312 },
    { month: 'Oct', reviews: 289 },
    { month: 'Nov', reviews: 378 },
    { month: 'Dec', reviews: 423 },
    { month: 'Jan', reviews: 456 },
  ],
  repoContributions: [
    { name: 'frontend-app', value: 35 },
    { name: 'api-gateway', value: 25 },
    { name: 'ml-pipeline', value: 20 },
    { name: 'mobile-sdk', value: 15 },
    { name: 'other', value: 5 },
  ],
  issuesByType: [
    { type: 'Security', count: 23 },
    { type: 'Performance', count: 45 },
    { type: 'Style', count: 67 },
    { type: 'Best Practices', count: 89 },
    { type: 'Bugs', count: 34 },
  ],
};

// ============================================
// PRICING PLANS
// ============================================
export const MOCK_PRICING_PLANS = [
  {
    name: 'Starter',
    price: 0,
    currency: '₹',
    description: 'Perfect for individual developers',
    features: [
      '3 repositories',
      '100 AI reviews/month',
      'Basic insights',
      'Community support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: 1999,
    currency: '₹',
    description: 'For growing teams',
    features: [
      'Unlimited repositories',
      '1,000 AI reviews/month',
      'Advanced analytics',
      'Priority support',
      'Custom rules',
      'Team collaboration',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 7999,
    currency: '₹',
    description: 'For large organizations',
    features: [
      'Everything in Pro',
      'Unlimited AI reviews',
      'SSO/SAML',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'On-premise option',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

// ============================================
// SAMPLE CODE
// ============================================
export const MOCK_SAMPLE_CODE = `import { createContext, useContext, useState, useEffect } from 'react';
import { TokenManager } from './tokenManager';
import { AuthStorage } from './storage';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = AuthStorage.getToken();
      if (token && !TokenManager.isExpired(token)) {
        const user = await fetchUser(token);
        setState({ isAuthenticated: true, user, loading: false });
      } else {
        setState({ isAuthenticated: false, user: null, loading: false });
      }
    };
    initAuth();
  }, []);

  const login = async (credentials: Credentials) => {
    const { token, user } = await authenticateUser(credentials);
    AuthStorage.setToken(token);
    setState({ isAuthenticated: true, user, loading: false });
  };

  const logout = () => {
    AuthStorage.clearToken();
    setState({ isAuthenticated: false, user: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}`;

// ============================================
// CODE FILES
// ============================================
export const MOCK_CODE_FILES = [
  {
    name: 'AuthProvider.tsx',
    path: 'src/auth/AuthProvider.tsx',
    language: 'typescript',
    changes: '+45 -12',
  },
  {
    name: 'tokenManager.ts',
    path: 'src/auth/tokenManager.ts',
    language: 'typescript',
    changes: '+89 -23',
  },
  {
    name: 'useAuth.ts',
    path: 'src/hooks/useAuth.ts',
    language: 'typescript',
    changes: '+34 -8',
  },
  {
    name: 'storage.ts',
    path: 'src/auth/storage.ts',
    language: 'typescript',
    changes: '+56 -15',
  },
  {
    name: 'AuthContext.tsx',
    path: 'src/auth/AuthContext.tsx',
    language: 'typescript',
    changes: '+78 -0',
  },
];
