/**
 * Type definitions for the application
 */

/**
 * Enum for product categories
 */
export enum Category {
    CLOTHING = "CLOTHING",
    FOOTWEAR = "FOOTWEAR",
    ACCESSORIES = "ACCESSORIES",
    ELECTRONICS = "ELECTRONICS",
    HOME_GOODS = "HOME_GOODS",
    BEAUTY = "BEAUTY",
    OTHER = "OTHER"
}

/**
 * Enum for target gender
 */
export enum TargetGender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    UNISEX = "UNISEX",
    UNKNOWN = "UNKNOWN"
}

/**
 * Product interface representing items identified by the AI
 */
export interface Product {
    name: string;
    iconCategory: string;
    category: Category | string;
    brand?: string;
    features?: string[];
    targetGender?: TargetGender;
    searchTerms?: string;
    confidence?: number;
    price?: string;
    productUrl?: string;
    thumbnailUrl?: string;
    amazonAsin?: string;
}

/**
 * Essential product data for referrer page (stripped down from AmazonScrapedProduct)
 */
export interface ReferrerProductData {
    amazonAsin?: string;
    thumbnailUrl: string;
    price?: number;
}

/**
 * Complete data package sent to referrer page
 */
export interface ReferrerData {
    pauseId: string;
    clickedPosition: number; // Index of clicked product in the products array
    products: ReferrerProductData[]; // All scraped products for context
}
