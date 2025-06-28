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
    imageId: string;
    amazonAsin?: string;
    price?: number;
    thumbnailUrl: string;
    productUrl: string | null;
}

/**
 * Represents the fully decoded data from the referrer URL.
 */
export interface DecodedUrlData {
    product?: Product;
    clickedAmazonProduct: AmazonProduct;
    clickedPosition: number;
    amazonProducts: AmazonProduct[];
}
