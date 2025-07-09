/**
 * Reusable app header/logo component
 */

import { useEffect, useState } from 'react';
import { BROWSER_EXTENSION_URLS } from '../../lib/browser-extensions';
import Button from './Button';
import Icon from './Icon';

interface AppHeaderProps {
    subtitle?: string;
    className?: string;
    showBrowserExtensionButton?: boolean;
}

const AppHeader = ({ subtitle, className = "", showBrowserExtensionButton = true }: AppHeaderProps) => {
    const [extensionUrl, setExtensionUrl] = useState<string | null>(null);

    useEffect(() => {
        setExtensionUrl(BROWSER_EXTENSION_URLS['chrome']);
    }, []);

    return (
        <div className={`relative text-center ${className}`}>
            {extensionUrl && showBrowserExtensionButton && (
                <div className="absolute top-0 right-0 hidden md:block">
                    <Button
                        variant="extension"
                        size="sm"
                        onClick={() => window.open(extensionUrl, '_blank')}
                        className="leading-tight !p-2 !text-xs"
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col text-left">
                                <span>Try our Chrome</span>
                                <span className="font-bold">extension</span>
                            </div>
                            <Icon name="external-link" size={16} />
                        </div>
                    </Button>
                </div>
            )}
            <h1 className="mb-2" style={{ fontSize: '50px', lineHeight: 1 }}>
                <span className="font-black" style={{ color: 'rgba(190, 190, 190, 1)' }}>Freeze</span>
                <span className="font-normal" style={{ color: '#30B3A4' }}>Frame</span>
            </h1>
            {subtitle && (
                <p className="text-gray-400 max-w-lg mx-auto">
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default AppHeader;
