/**
 * Utility functions for the application
 */

import { Product } from "./types";

/**
 * Converts an image file to a base64-encoded PNG string
 * @param file The image file to convert
 * @returns Promise resolving to the base64-encoded string (without data URL prefix)
 */
export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        // Get base64 string without the data URL prefix
        const base64String = canvas.toDataURL('image/png').split(',')[1];
        resolve(base64String);
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
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
  return `https://www.amazon.com/s?k=${encodedName}`;
};