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
    // Use the remote production server
    const serverEnv: ServerEnvironment = 'remote';
    console.log(`Using server environment: ${serverEnv}`);
    return SERVER_URLS[serverEnv];
};

// Helper function to get full endpoint URL
export const getEndpointUrl = (endpoint: string): string => {
    const baseUrl = getServerBaseUrl();
    return `${baseUrl}${endpoint}`;
};
