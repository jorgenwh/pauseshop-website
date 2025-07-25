import { useEffect } from 'react';
import { BROWSER_EXTENSION_URLS } from '@/lib/browser-extensions';
import { trackExtensionRedirectPage } from '@/lib/api/client';

const ExtensionRedirect = () => {
    useEffect(() => {
        // Track the page visit
        trackExtensionRedirectPage();
        
        const extensionUrl = BROWSER_EXTENSION_URLS.chrome;
        if (extensionUrl) {
            window.location.href = extensionUrl;
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
            <div className="text-center">
                <p className="text-lg">Redirecting to Chrome Extension...</p>
            </div>
        </div>
    );
};

export default ExtensionRedirect;
