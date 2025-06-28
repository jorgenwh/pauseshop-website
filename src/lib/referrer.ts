/**
 * Utility functions for decoding referrer data from URL
 */

import { ReferrerData } from "./types";

export function decodeReferrerData(encodedData: string): ReferrerData | null {
    try {
        // Restore base64 padding and characters
        let base64String = encodedData
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        
        // Add padding if needed
        while (base64String.length % 4) {
            base64String += '=';
        }
        
        const jsonString = atob(base64String);
        return JSON.parse(jsonString) as ReferrerData;
    } catch (error) {
        console.error('[PauseShop:ReferrerDecoder] Failed to decode referrer data:', error);
        return null;
    }
}
