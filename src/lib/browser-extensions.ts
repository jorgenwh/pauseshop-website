export type Browser = 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'unknown';

export const BROWSER_EXTENSION_URLS: Record<Browser, string | null> = {
    chrome: 'https://chromewebstore.google.com/detail/pauseshop/fcegkghmhhbgegalihmbpfchcmflaadd',
    firefox: null, // TODO: Add Firefox extension URL
    safari: null, // TODO: Add Safari extension URL
    edge: null, // TODO: Add Edge extension URL
    opera: null, // TODO: Add Opera extension URL
    unknown: null,
};

export const getBrowser = (): Browser => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('chrome')) return 'chrome';
    if (userAgent.includes('firefox')) return 'firefox';
    if (userAgent.includes('safari') && !userAgent.includes('chrome')) return 'safari';
    if (userAgent.includes('edg')) return 'edge';
    if (userAgent.includes('opr')) return 'opera';
    return 'unknown';
};

import { ExtensionData, ExtensionClickHistoryEntry } from './types';

/**
 * Retrieves data from the browser extension's storage.
 * It dynamically gets the extension ID from the URL.
 * @returns A promise that resolves with the stored data, or null if the extension is not available.
 */
export const getExtensionData = (): Promise<ExtensionData | null> => {
    return new Promise((resolve) => {
        const urlParams = new URLSearchParams(window.location.search);
        const extensionId = urlParams.get('extensionId');

        if (!extensionId) {
            // If no extensionId is in the URL, we cannot proceed.
            resolve(null);
            return;
        }

        if (window.chrome && chrome.runtime) {
            chrome.runtime.sendMessage(
                extensionId,
                { command: 'identify_and_get_data' },
                (response: { app?: string; data?: ExtensionData }) => {
                    if (chrome.runtime.lastError) {
                        console.error(`Could not connect to extension with ID: ${extensionId}. Error: ${chrome.runtime.lastError.message}`);
                        resolve(null);
                        return;
                    }

                    // Verify the response is from our extension
                    if (response && response.app === 'FreezeFrame' && response.data) {
                        resolve(response.data);
                    } else {
                        console.warn(`Received an invalid response from extension ID: ${extensionId}.`);
                        resolve(null);
                    }
                }
            );
        } else {
            // Extension context not available
            resolve(null);
        }
    });
};

/**
 * Updates the click history in the browser extension's storage.
 * @param updatedHistory The updated click history array to send to the extension
 * @returns A promise that resolves with success status
 */
export const updateExtensionClickHistory = (updatedHistory: ExtensionClickHistoryEntry[]): Promise<boolean> => {
    return new Promise((resolve) => {
        const urlParams = new URLSearchParams(window.location.search);
        const extensionId = urlParams.get('extensionId');

        if (!extensionId) {
            console.warn('No extension ID available, cannot update click history');
            resolve(false);
            return;
        }

        if (window.chrome && chrome.runtime) {
            chrome.runtime.sendMessage(
                extensionId,
                {
                    command: 'update_click_history',
                    clickHistory: updatedHistory
                },
                (response: { app?: string; success?: boolean; error?: string }) => {
                    if (chrome.runtime.lastError) {
                        console.error(`Failed to update extension click history: ${chrome.runtime.lastError.message}`);
                        resolve(false);
                        return;
                    }

                    if (response && response.app === 'FreezeFrame' && response.success) {
                        resolve(true);
                    } else {
                        console.error('Failed to update extension click history:', response?.error || 'Unknown error');
                        resolve(false);
                    }
                }
            );
        } else {
            console.warn('Chrome extension context not available');
            resolve(false);
        }
    });
};
