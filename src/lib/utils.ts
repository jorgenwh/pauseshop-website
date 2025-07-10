/**
 * Utility functions for the application
 */

import { Product } from "./types";
import { AMAZON_AFFILIATE_TAG } from './constants';

/**
 * Calculate base64 size more efficiently
 */
const getBase64SizeMB = (base64String: string): number => {
    const base64Data = base64String.split(',')[1] || base64String;
    return (base64Data.length * 0.75) / (1024 * 1024); // More efficient calculation
};

/**
 * Smart format selection based on image characteristics
 */
const selectOptimalFormat = (img: HTMLImageElement): { format: string; quality: number } => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
        return { format: 'image/jpeg', quality: 0.8 };
    }
    
    // Sample a small portion of the image to analyze
    const sampleSize = 100;
    canvas.width = sampleSize;
    canvas.height = sampleSize;
    ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
    
    const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
    const data = imageData.data;
    
    let hasTransparency = false;
    let colorVariance = 0;
    const totalPixels = sampleSize * sampleSize;
    
    // Analyze image characteristics
    for (let i = 0; i < data.length; i += 4) {
        // Check for transparency
        if (data[i + 3] < 255) {
            hasTransparency = true;
        }
        
        // Calculate color variance (simplified)
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = (r + g + b) / 3;
        colorVariance += Math.abs(r - gray) + Math.abs(g - gray) + Math.abs(b - gray);
    }
    
    colorVariance /= totalPixels;
    
    // Select format based on characteristics
    if (hasTransparency) {
        return { format: 'image/png', quality: 1.0 };
    } else if (colorVariance < 30) {
        // Low color variance - PNG might be better
        return { format: 'image/png', quality: 1.0 };
    } else {
        // High color variance - JPEG is better
        return { format: 'image/jpeg', quality: 0.85 };
    }
};

/**
 * Progressive image compression with binary search for optimal quality
 */
const compressImageProgressive = (
    img: HTMLImageElement,
    maxSizeMB: number,
    maxWidth = 2048,
    maxHeight = 2048
): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { 
        alpha: false, // Disable alpha channel for JPEG
        willReadFrequently: false // Optimize for single read
    });
    
    if (!ctx) {
        throw new Error('Could not get canvas context');
    }

    // Calculate optimal dimensions
    let { width, height } = img;
    const aspectRatio = width / height;
    
    // Reduce dimensions if too large
    if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
    }
    if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
    }
    
    // Ensure dimensions are integers
    width = Math.floor(width);
    height = Math.floor(height);

    canvas.width = width;
    canvas.height = height;
    
    // Use high-quality image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);
    
    // Binary search for optimal quality
    let minQuality = 0.1;
    let maxQuality = 0.95;
    let bestDataUrl = '';
    let bestSize = Infinity;
    
    console.log(`🔍 Starting binary search compression (target: ${maxSizeMB}MB, dimensions: ${width}x${height})`);
    
    // Limit iterations to prevent infinite loops
    for (let i = 0; i < 8; i++) {
        const quality = (minQuality + maxQuality) / 2;
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const size = getBase64SizeMB(dataUrl);
        
        console.log(`  🎯 Iteration ${i + 1}: quality=${quality.toFixed(2)}, size=${size.toFixed(2)}MB`);
        
        if (size <= maxSizeMB) {
            bestDataUrl = dataUrl;
            bestSize = size;
            minQuality = quality; // Try higher quality
        } else {
            maxQuality = quality; // Reduce quality
        }
        
        // If we found a good enough compression, break early
        if (size <= maxSizeMB && size > maxSizeMB * 0.8) {
            console.log(`  ✅ Found optimal compression early at iteration ${i + 1}`);
            break;
        }
    }
    
    // If binary search didn't work, try dimension reduction
    if (bestSize > maxSizeMB) {
        console.log(`📐 Binary search insufficient, reducing dimensions...`);
        const scaleFactor = Math.sqrt(maxSizeMB / bestSize);
        const newWidth = Math.floor(width * scaleFactor);
        const newHeight = Math.floor(height * scaleFactor);
        
        console.log(`  📏 Scaling from ${width}x${height} to ${newWidth}x${newHeight} (factor: ${scaleFactor.toFixed(2)})`);
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        bestDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        console.log(`  📦 Final size after dimension reduction: ${getBase64SizeMB(bestDataUrl).toFixed(2)}MB`);
    }
    
    return bestDataUrl;
};

/**
 * Optimized image conversion with smart compression
 */
export const convertImageToBase64 = (
    file: File, 
    maxSizeMB: number = 10
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const fileSizeMB = file.size / (1024 * 1024);
        
        // Early return for very small files
        if (fileSizeMB < 0.1) {
            console.log(`📸 Tiny image processed (no processing needed):
              📁 Size: ${fileSizeMB.toFixed(3)}MB
              ⚡ Skipped compression`);
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                try {
                    // For small files, try without compression first
                    if (fileSizeMB <= maxSizeMB * 0.8) {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        
                        if (ctx) {
                            ctx.drawImage(img, 0, 0);
                            const { format, quality } = selectOptimalFormat(img);
                            const dataUrl = canvas.toDataURL(format, quality);
                            const finalSizeMB = getBase64SizeMB(dataUrl);
                            
                            if (finalSizeMB <= maxSizeMB) {
                                console.log(`📸 Image processed (no compression needed):
                                  📁 Original: ${fileSizeMB.toFixed(2)}MB
                                  📦 Final: ${finalSizeMB.toFixed(2)}MB
                                  🎯 Format: ${format}
                                  ⚡ Quality: ${quality}`);
                                resolve(dataUrl);
                                return;
                            }
                        }
                    }
                    
                    // Use progressive compression for larger files
                    const compressedDataUrl = compressImageProgressive(img, maxSizeMB);
                    const finalSizeMB = getBase64SizeMB(compressedDataUrl);
                    
                    if (finalSizeMB > maxSizeMB) {
                        console.error(`❌ Compression failed:
                          📁 Original: ${fileSizeMB.toFixed(2)}MB
                          📦 Final: ${finalSizeMB.toFixed(2)}MB
                          🎯 Target: ${maxSizeMB}MB`);
                        reject(new Error(`Unable to compress image below ${maxSizeMB}MB. Please use a smaller image.`));
                        return;
                    }
                    
                    // Calculate compression statistics
                    const compressionRatio = fileSizeMB / finalSizeMB;
                    const sizeReduction = ((fileSizeMB - finalSizeMB) / fileSizeMB) * 100;
                    
                    console.log(`🗜️ Image compressed successfully:
                      📁 Original: ${fileSizeMB.toFixed(2)}MB
                      📦 Final: ${finalSizeMB.toFixed(2)}MB
                      📊 Compression: ${compressionRatio.toFixed(1)}x smaller
                      📉 Size reduction: ${sizeReduction.toFixed(1)}%
                      🖼️ Dimensions: ${img.width}x${img.height}`);
                    
                    resolve(compressedDataUrl);
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
 * Constructs an Amazon search URL from a product's search terms or name
 * @param product The product object containing searchTerms or name
 * @returns Amazon search URL
 */
export const constructAmazonSearchUrl = (product: Product): string => {
    // Use the searchTerms if available, otherwise use the product name
    const searchTerm = product.searchTerms || product.name;
    const encodedName = encodeURIComponent(searchTerm);
    return `https://www.amazon.com/s?k=${encodedName}&tag=${AMAZON_AFFILIATE_TAG}`;
};


/**
 * Fetches an image from a URL and converts it to a base64 string.
 * @param url The URL of the image to fetch.
 * @returns A promise that resolves with the base64-encoded image data.
 */
export const imageUrlToBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.blob();
            })
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result as string);
                };
                reader.onerror = () => {
                    reject(new Error("Failed to convert blob to base64"));
                };
                reader.readAsDataURL(blob);
            })
            .catch(error => {
                reject(new Error(`Failed to fetch image: ${error.message}`));
            });
    });
};

// Re-export deep search utilities
export * from './utils/deepSearch';

// Utility function for combining classes (needed for Aceternity UI components)
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
