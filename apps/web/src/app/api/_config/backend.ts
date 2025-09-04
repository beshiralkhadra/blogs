/**
 * Centralized backend API configuration
 *
 * This module provides a single source of truth for backend API URL configuration
 * across all web API routes, eliminating inconsistencies and improving maintainability.
 */

const BACKEND_API_URL = process.env.API_BASE_URL;
const FALLBACK_URL = 'http://localhost:4433';

/**
 * Get the backend API base URL
 *
 * @throws {Error} If no API_BASE_URL is configured in production
 * @returns {string} The backend API base URL
 */
export function getBackendApiUrl(): string {
  // In production, we require the API_BASE_URL to be explicitly set
  if (process.env.NODE_ENV === 'production' && !BACKEND_API_URL) {
    throw new Error(
      'API_BASE_URL environment variable is required in production. ' +
      'Please set it to the backend API server URL (e.g., http://api:4433)'
    );
  }

  const apiUrl = BACKEND_API_URL || FALLBACK_URL;

  // Log the configuration for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Backend Config] Using API URL: ${apiUrl}`);
  }

  return apiUrl;
}

/**
 * Build a complete API endpoint URL
 *
 * @param {string} endpoint - The API endpoint path (e.g., '/auth/login')
 * @returns {string} The complete URL
 */
export function getApiEndpoint(endpoint: string): string {
  const baseUrl = getBackendApiUrl();

  // Ensure endpoint starts with '/'
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  return `${baseUrl}${normalizedEndpoint}`;
}

/**
 * Get backend API URL without throwing errors (for backwards compatibility)
 *
 * @returns {string} The backend API base URL
 */
export function getBackendApiUrlSafe(): string {
  return BACKEND_API_URL || FALLBACK_URL;
}
