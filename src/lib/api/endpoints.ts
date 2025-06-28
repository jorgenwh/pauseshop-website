/**
 * Server configuration constants
 * This file centralizes server URL configurations
 */

// Server environment types
export type ServerEnvironment = 'remote' | 'local';

// Server URLs for different environments
export const SERVER_URLS = {
    remote: 'https://pauseshop-server-rfrxaro25a-uc.a.run.app',
    local: 'http://localhost:3000'
};

// Helper function to get base URL for the current environment
export const getServerBaseUrl = (): string => {
    // Get server environment from build-time variable, default to remote
    const serverEnv: ServerEnvironment = (globalThis as Record<string, unknown>).__SERVER_ENV__ as ServerEnvironment || 'remote';
    console.log(`Using server environment: ${serverEnv}`);
    return SERVER_URLS[serverEnv];
};

// Helper function to get full endpoint URL
export const getEndpointUrl = (endpoint: string): string => {
    const baseUrl = getServerBaseUrl();
    return `${baseUrl}${endpoint}`;
};
