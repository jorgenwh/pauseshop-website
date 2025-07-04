/**
 * UI-related constants to avoid magic numbers throughout the codebase
 */

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
    FADE_IN_DELAY: 100,
    BUTTON_TRANSITION: 500,
    CAROUSEL_SCROLL: 300,
    DEEP_SEARCH_AUTO_SWITCH: 300,
} as const;

// Layout dimensions
export const LAYOUT_DIMENSIONS = {
    BUTTON_BAR_WIDTH_RATIO: 0.8,    // 80% of button width
    BUTTON_BAR_OFFSET_RATIO: 0.1,   // 10% offset to center the bar
    STICKY_TOP_OFFSET: 16,          // top-4 in Tailwind (4 * 4px)
    CAROUSEL_ITEM_HEIGHT: 80,
} as const;

// Deep search related
export const DEEP_SEARCH = {
    MIN_PRODUCTS_FOR_RANKING: 1,
    RANKING_DELAY_MS: 1000,
    AUTO_EXECUTE_DELAY: 100,
} as const;

// Screenshot related
export const SCREENSHOT = {
    MAX_HEIGHT: 400,
    MIN_HEIGHT: 200,
} as const;

// Product display
export const PRODUCT_DISPLAY = {
    CONFIDENCE_THRESHOLD_HIGH: 90,
    CONFIDENCE_DISPLAY_MULTIPLIER: 100,
    PRICE_DISPLAY_PRECISION: 2,
} as const;