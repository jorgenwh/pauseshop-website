/**
 * Decodes referrer data from a custom URL format.
 */
import {
    DecodedUrlData,
    AmazonProduct,
    Product,
    Category,
    TargetGender,
} from "./types";

// --- Constants based on URL_RECONSTRUCTION_GUIDE.md ---

const IMAGE_ID_LENGTH = 11;
const ASIN_LENGTH = 10;
const FULL_PRODUCT_LENGTH = IMAGE_ID_LENGTH + ASIN_LENGTH;

const CATEGORY_MAP: Category[] = [
    Category.CLOTHING, Category.ELECTRONICS, Category.FURNITURE, Category.ACCESSORIES,
    Category.FOOTWEAR, Category.HOME_DECOR, Category.BOOKS_MEDIA, Category.SPORTS_FITNESS,
    Category.BEAUTY_PERSONAL_CARE, Category.KITCHEN_DINING, Category.OTHER,
];

const GENDER_MAP: TargetGender[] = [
    TargetGender.MEN, TargetGender.WOMEN, TargetGender.UNISEX, TargetGender.BOY, TargetGender.GIRL,
];

// --- URL Reconstruction ---

function reconstructThumbnailUrl(imageId: string): string {
    return `https://m.media-amazon.com/images/I/${imageId}._AC_UL320_.jpg`;
}

function reconstructProductUrl(asin?: string): string | null {
    return asin ? `https://www.amazon.com/dp/${asin}` : null;
}

// --- Parsers for New Fixed-Length Format ---

function parseProductContext(productStr: string): Product {
    const parts = productStr.split("~");
    return {
        name: parts[0] || "Unknown Product",
        iconCategory: parts[1] || "other",
        category: CATEGORY_MAP[parseInt(parts[2], 10)] || Category.OTHER,
        brand: parts[3] || "Unknown Brand",
        primaryColor: parts[4] || "#000000",
        secondaryColors: parts[5] ? parts[5].split(",") : [],
        features: parts[6] ? parts[6].split(",") : [],
        targetGender: GENDER_MAP[parseInt(parts[7], 10)] || TargetGender.UNISEX,
        searchTerms: parts[8] || "",
        confidence: (parseInt(parts[9], 10) || 0) / 10,
    };
}

function parseAmazonProduct(productStr: string): Omit<AmazonProduct, 'thumbnailUrl' | 'productUrl'> {
    const imageId = productStr.substring(0, IMAGE_ID_LENGTH);
    let asin: string | undefined;
    let price: number | undefined;

    if (productStr.length === IMAGE_ID_LENGTH) {
        // Only imageId
    } else if (productStr.length === FULL_PRODUCT_LENGTH) {
        asin = productStr.substring(IMAGE_ID_LENGTH, FULL_PRODUCT_LENGTH);
    } else if (productStr.length > IMAGE_ID_LENGTH && productStr.length < FULL_PRODUCT_LENGTH) {
        const priceStr = productStr.substring(IMAGE_ID_LENGTH);
        price = parseInt(priceStr, 10) / 100;
    } else if (productStr.length > FULL_PRODUCT_LENGTH) {
        asin = productStr.substring(IMAGE_ID_LENGTH, FULL_PRODUCT_LENGTH);
        const priceStr = productStr.substring(FULL_PRODUCT_LENGTH);
        price = parseInt(priceStr, 10) / 100;
    }

    return { imageId, amazonAsin: asin, price };
}

export const decodeUrlData = (encodedUrlData: string): DecodedUrlData | null => {
    const [productStr, amazonDataStr] = encodedUrlData.split("||");
    if (!productStr || !amazonDataStr) return null;

    const product = parseProductContext(productStr);
    const amazonParts = amazonDataStr.split("|");
    const clickedPosition = parseInt(amazonParts[0], 10) || 0;
    const contextProductParts = amazonParts.slice(1);

    const amazonProducts: AmazonProduct[] = contextProductParts
        .map(part => {
            if (!part || part.length < IMAGE_ID_LENGTH) return null;
            const parsed = parseAmazonProduct(part);
            return {
                ...parsed,
                thumbnailUrl: reconstructThumbnailUrl(parsed.imageId),
                productUrl: reconstructProductUrl(parsed.amazonAsin),
            };
        })
        .filter((p): p is AmazonProduct => p !== null);

    if (amazonProducts.length === 0) return null;

    const clickedAmazonProduct = amazonProducts[clickedPosition] || amazonProducts[0];

    return {
        product,
        clickedAmazonProduct,
        clickedPosition,
        amazonProducts,
    };
}
