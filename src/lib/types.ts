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
    category: Category;
    brand: string;
    features: string[];
    targetGender: TargetGender;
    searchTerms: string;
    confidence: number;
}
