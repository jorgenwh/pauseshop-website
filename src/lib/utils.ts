/**
 * Utility functions for the application
 */

import { Product } from "./types";

/**
 * Calculates the size of a base64 string in MB
 * @param base64String The base64 string to measure
 * @returns Size in MB
 */
const getBase64SizeMB = (base64String: string): number => {
    // Remove data URL prefix if present
    const base64Data = base64String.split(',')[1] || base64String;
    // Calculate size: base64 is ~4/3 the size of original data
    const sizeInBytes = (base64Data.length * 3) / 4;
    return sizeInBytes / (1024 * 1024);
};

/**
 * Compresses an image to fit within size constraints
 * @param img The image element to compress
 * @param maxSizeMB Maximum size in MB
 * @param maxWidth Maximum width (optional)
 * @param maxHeight Maximum height (optional)
 * @returns Compressed image as base64 data URL
 */
const compressImage = (
    img: HTMLImageElement, 
    maxSizeMB: number, 
    maxWidth?: number, 
    maxHeight?: number
): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
        throw new Error('Could not get canvas context');
    }

    // Calculate new dimensions while maintaining aspect ratio
    let { width, height } = img;
    
    // Apply max width/height constraints if provided
    if (maxWidth && width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
    }
    
    if (maxHeight && height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
    }

    canvas.width = width;
    canvas.height = height;
    
    // Draw the image on the canvas
    ctx.drawImage(img, 0, 0, width, height);
    
    // Start with high quality and reduce if needed
    let quality = 0.9;
    let dataUrl = canvas.toDataURL('image/jpeg', quality);
    
    // Reduce quality until we're under the size limit
    while (getBase64SizeMB(dataUrl) > maxSizeMB && quality > 0.1) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
    }
    
    // If still too large, try reducing dimensions
    if (getBase64SizeMB(dataUrl) > maxSizeMB) {
        const scaleFactor = 0.8;
        canvas.width = width * scaleFactor;
        canvas.height = height * scaleFactor;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        
        // Recursively reduce size if still too large
        if (getBase64SizeMB(dataUrl) > maxSizeMB) {
            // Create a new image element with the compressed data and try again
            const tempImg = new Image();
            tempImg.src = dataUrl;
            return compressImage(tempImg, maxSizeMB, canvas.width * scaleFactor, canvas.height * scaleFactor);
        }
    }
    
    return dataUrl;
};

/**
 * Converts an image file to a base64-encoded data URL string with size optimization
 * @param file The image file to convert
 * @param maxSizeMB Maximum size in MB (default: 10)
 * @returns Promise resolving to the complete data URL string
 */
export const convertImageToBase64 = (file: File, maxSizeMB: number = 10): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Check initial file size
        const fileSizeMB = file.size / (1024 * 1024);
        
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                try {
                    let dataUrl: string;
                    
                    // If the original file is small enough, try without compression first
                    if (fileSizeMB <= maxSizeMB) {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        
                        if (!ctx) {
                            throw new Error('Could not get canvas context');
                        }
                        
                        ctx.drawImage(img, 0, 0);
                        dataUrl = canvas.toDataURL('image/png');
                        
                        // Check if the base64 result is still under the limit
                        if (getBase64SizeMB(dataUrl) <= maxSizeMB) {
                            resolve(dataUrl);
                            return;
                        }
                    }
                    
                    // Compress the image if it's too large
                    dataUrl = compressImage(img, maxSizeMB);
                    
                    // Final size check
                    if (getBase64SizeMB(dataUrl) > maxSizeMB) {
                        reject(new Error(`Image is too large. Please use an image smaller than ${maxSizeMB}MB.`));
                        return;
                    }
                    
                    resolve(dataUrl);
                } catch (error) {
                    reject(error);
                }
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = reader.result as string;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

/**
 * Validates if a file is an allowed image type (PNG or JPG/JPEG)
 * @param file The file to validate
 * @returns Boolean indicating if the file is a valid image type
 */
export const isImageFile = (file: File): boolean => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    return allowedTypes.includes(file.type);
};

/**
 * Validates if a file size is within the allowed limit
 * @param file The file to validate
 * @param maxSizeMB Maximum size in MB
 * @returns Object with isValid boolean and error message if invalid
 */
export const validateFileSize = (file: File, maxSizeMB: number): { isValid: boolean; error?: string } => {
    const fileSizeMB = file.size / (1024 * 1024);
    
    if (fileSizeMB > maxSizeMB) {
        return {
            isValid: false,
            error: `File size (${fileSizeMB.toFixed(1)}MB) exceeds the maximum limit of ${maxSizeMB}MB. The image will be automatically compressed during processing.`
        };
    }
    
    return { isValid: true };
};

/**
 * Constructs an Amazon search URL from a product's search terms or name
 * @param product The product object containing searchTerms or name
 * @returns Amazon search URL
 */
export const constructAmazonSearchUrl = (product: Product): string => {
    // Use the searchTerms if available, otherwise use the product name
    const searchTerm = product.searchTerms || product.name;
    const encodedName = encodeURIComponent(searchTerm);
    return `https://www.amazon.com/s?k=${encodedName}`;
};
