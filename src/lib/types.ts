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
    imageId: string;
    amazonAsin?: string;
    price?: number;
    thumbnailUrl: string;
    productUrl: string | null;
}

/**
 * Represents the fully decoded data from the referrer URL.
 * This supports both the new fixed-length format and the legacy format.
 */
export interface DecodedReferrerData {
    product?: Product; // Available in new format
    clickedAmazonProduct: AmazonProduct;
    clickedPosition: number;
    amazonProducts: AmazonProduct[];
}

/**
 * Legacy data structure for backward compatibility.
 */
export interface LegacyReferrerData {
    c: number; // clickedPosition
    p: {
        i: string; // imageId
        a?: string; // asin
        pr?: number; // price
    }[];
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
