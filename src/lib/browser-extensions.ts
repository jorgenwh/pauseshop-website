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
