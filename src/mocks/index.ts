/**
 * Mock data exports
 * Use environment-conditional loading for production vs development
 */

export * from './mockData';

/**
 * Helper to check if we should use mock data
 * In production, this would be false and data would come from the database
 */
export const useMockData = (): boolean => {
  // For demo purposes, always use mock data
  // In production, set VITE_USE_MOCK_DATA=false
  return import.meta.env.VITE_USE_MOCK_DATA !== 'false';
};
