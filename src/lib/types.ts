/**
 * Type definitions for the application
 */

/**
 * Enum for product categories
 */
export enum Category {
    CLOTHING = "clothing",
    ELECTRONICS = "electronics",
    FURNITURE = "furniture",
    ACCESSORIES = "accessories",
    FOOTWEAR = "footwear",
    HOME_DECOR = "home_decor",
    BOOKS_MEDIA = "books_media",
    SPORTS_FITNESS = "sports_fitness",
    BEAUTY_PERSONAL_CARE = "beauty_personal_care",
    KITCHEN_DINING = "kitchen_dining",
    OTHER = "other",
}

/**
 * Enum for target gender, aligned with the values used in encoding.
 */
export enum TargetGender {
    MEN = "men",
    WOMEN = "women",
    UNISEX = "unisex",
    BOY = "boy",
    GIRL = "girl",
}

/**
 * Shared metadata about the identified product.
 */
export interface Product {
    name: string;
    iconCategory: string;
    category: Category;
    brand: string;
    primaryColor: string;
    secondaryColors: string[];
    features: string[];
    targetGender: TargetGender;
    searchTerms: string;
    confidence: number;
}

/**
 * Represents a single Amazon product parsed from the encoded data.
 */
export interface AmazonProduct {
    id: string;
    amazonAsin?: string;
    price?: number;
    thumbnailUrl: string;
    productUrl?: string | null;
    position: number;
}

// --- Types for Browser Extension Communication ---

/**
 * Represents a group of products associated with a single identified item, as defined in the extension.
 */
export interface ExtensionProductGroup {
    product: Product;
    scrapedProducts: AmazonProduct[];
}

/**
 * Represents the stored product data for a given pause session, as defined in the extension.
 */
export interface ExtensionProductStorage {
    pauseId: string;
    productGroups: ExtensionProductGroup[];
}

/**
 * Represents the data structure retrieved from the extension's storage.
 */
export interface ExtensionData {
    clickedProduct: AmazonProduct | null;
    productStorage: ExtensionProductStorage | null;
}


// --- Types for AI Product Ranking ---

export interface ThumbnailData {
    id: string;      // Unique identifier (e.g., "1", "2")
    image: string;   // base64 thumbnail image
}

export interface RankingRequest {
    productName: string;
    category: Category;
    thumbnails: ThumbnailData[];
    originalImage?: string; // Fallback if session image fails
    pauseId?: string;       // Primary identifier for session image
}

export interface RankingResult {
    id: string;      // Matches thumbnail ID
    similarityScore: number;   // 0-1 similarity score
    rank: number;    // 1-N position
}

export interface RankingCompleteResponse {
    totalRankings: number;
    processingTime: number;
    // Not including usage details on frontend for now
}

export interface RankingCallbacks {
    onRanking: (ranking: RankingResult) => void;
    onComplete: (response: RankingCompleteResponse) => void;
    onError: (error: Error) => void;
}
