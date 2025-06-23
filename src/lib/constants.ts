/**
 * Application constants
 */

// Colors
export const COLORS = {
    // Brand colors
    primary: '#30B3A4', // Teal

    // Dark mode colors
    darkBg: 'bg-gray-900',
    darkCard: 'bg-gray-800',
    darkCardHover: 'bg-gray-700',
    darkBorder: 'border-gray-700',
    darkBorderLight: 'border-gray-600',

    // Text colors
    textLight: 'text-white',
    textMuted: 'text-gray-400',
    textSubtle: 'text-gray-300',

    // UI element colors
    buttonPrimary: 'bg-[#30B3A4]',
    buttonPrimaryHover: 'hover:bg-[#30B3A4]/80',
    buttonPrimaryDisabled: 'bg-[#30B3A4]/70',
    buttonSecondary: 'bg-gray-700',
    buttonSecondaryHover: 'hover:bg-gray-600',
};

// Common class combinations
export const CLASSES = {
    card: `${COLORS.darkCard} rounded-lg shadow-md p-6 ${COLORS.darkBorder} border`,
    heading: `text-xl font-semibold mb-4 ${COLORS.textLight}`,
    gradientBg: 'bg-gradient-to-r from-gray-800 to-[#30B3A4]/20',
    tag: 'inline-block bg-gray-600 text-gray-200 text-xs px-2 py-1 rounded',
    keyboardKey: 'bg-gray-600 px-1.5 py-0.5 rounded text-xs mr-1',
};

// File upload settings
export const UPLOAD_CONFIG = {
    acceptedFileTypes: ['image/png', 'image/jpeg', 'image/jpg'],
    maxSizeMB: 10,
};

// App text content
export const TEXT = {
    appName: 'PauseShop',
    appDescription: 'Pause your favorite videos, upload a screenshot, and let AI find the products on Amazon for you!',
    uploadTitle: 'Upload an Image',
    dragDropText: 'Drag and drop an image, or click to browse',
    dragDropActive: 'Drop the image here',
    fileTypeInfo: 'PNG and JPG/JPEG files only',
    analyzeButton: 'Analyze Image',
    processingText: 'Processing...',
    cancelButton: 'Cancel',
    errorTitle: 'Error',
    productsTitle: 'Detected Products',
    productsFoundText: (count: number) => `${count} product${count !== 1 ? 's' : ''} found`,
    amazonLinkText: 'Find on Amazon',
    unknownBrand: 'Unknown brand',
};

// Tips content
export const TIPS = {
    bestPractices: [
        'Take clear screenshots from videos',
        'Pause when products are clearly visible',
        'Include the whole item in the frame',
        'PNG or JPG formats only',
    ],
    screenshotWindows: [
        { key: 'PrtScn', description: 'Capture entire screen' },
        { key: 'Alt+PrtScn', description: 'Capture active window' },
        { key: 'Win+Shift+S', description: 'Snipping tool' },
    ],
    screenshotMac: [
        { key: '⌘+Shift+3', description: 'Capture entire screen' },
        { key: '⌘+Shift+4', description: 'Capture selected area' },
        { key: '⌘+Shift+5', description: 'Screenshot options' },
    ],
};
