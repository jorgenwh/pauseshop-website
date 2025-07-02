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

import { EXTENSION_ID } from './constants';
import { ExtensionData } from './types';

/**
 * Retrieves data from the browser extension's storage.
 * @returns A promise that resolves with the stored data, or null if the extension is not available.
 */
export const getExtensionData = (): Promise<ExtensionData | null> => {
    return new Promise((resolve) => {
        if (window.chrome && chrome.runtime) {
            try {
                chrome.runtime.sendMessage(
                    EXTENSION_ID,
                    { command: 'getStorage' },
                    (response) => {
                        if (chrome.runtime.lastError) {
                            // This will handle other runtime errors, but not the invalid ID error.
                            console.error('Error communicating with extension:', chrome.runtime.lastError.message);
                            resolve(null);
                        } else if (response && response.success) {
                            resolve(response.data);
                        } else {
                            // This case handles when the extension is found but returns an error.
                            console.error('Failed to get data from extension:', response?.error);
                            resolve(null);
                        }
                    }
                );
            } catch (error) {
                // This will catch the synchronous error thrown for an invalid extension ID.
                console.error(
                    `[PauseShop] Failed to connect to the extension. This might be because the EXTENSION_ID is incorrect.
                    To fix this:
                    1. Go to chrome://extensions in your browser.
                    2. Find the PauseShop extension and copy its ID.
                    3. Update the EXTENSION_ID in 'pauseshop-website/src/lib/constants.ts'.
                    
                    Error details:`,
                    error
                );
                resolve(null);
            }
        } else {
            // Extension not available
            resolve(null);
        }
    });
};
