import React from 'react';
import { ImagePreview } from '../../features/image-upload';
import { Card } from '../ui';
import ClickHistoryList from '../../features/product-display/components/ClickHistoryList';
import { ExtensionClickHistoryEntry } from '../../lib/types';

interface ScreenshotSectionProps {
    imageUrl: string | null;
    screenshotError: string | null;
    clickHistory: ExtensionClickHistoryEntry[];
    onHistoryItemClick: (item: ExtensionClickHistoryEntry) => void;
}

const ScreenshotSection: React.FC<ScreenshotSectionProps> = ({
    imageUrl,
    screenshotError,
    clickHistory,
    onHistoryItemClick,
}) => {
    return (
        <div className="lg:col-span-1">
            <Card className="sticky top-4">
                <h2 className="text-xl font-semibold mb-4 text-white">Pause Screenshot</h2>
                {screenshotError ? (
                    <div className="max-h-[400px] overflow-hidden flex items-center justify-center rounded-lg shadow-md bg-gray-700 min-h-[200px]">
                        <div className="text-center">
                            <div className="text-lg font-semibold" style={{ color: '#ff4444' }}>{screenshotError}</div>
                        </div>
                    </div>
                ) : imageUrl ? (
                    <ImagePreview imageUrl={imageUrl} />
                ) : (
                    <div className="max-h-[400px] overflow-hidden rounded-lg shadow-md bg-gray-700 min-h-[200px]">
                        {/* Blank while loading */}
                    </div>
                )}
            </Card>
            <ClickHistoryList history={clickHistory} onHistoryItemClick={onHistoryItemClick} />
        </div>
    );
};

export default ScreenshotSection;
