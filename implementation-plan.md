# Image to Amazon Product Search Website Implementation Plan

## Overview
This document outlines the implementation plan for a website that allows users to upload images, processes them through an AI model, and displays Amazon product search links based on the AI's analysis.

## Project Structure

```
src/
├── components/
│   ├── ui/            # UI components from shadcn/ui
│   ├── FileUpload.tsx # Component for handling file uploads
│   ├── ImagePreview.tsx # Component for showing the uploaded image
│   ├── ProductList.tsx # Component for displaying product results
│   └── ProductItem.tsx # Component for individual product display
├── pages/
│   ├── UploadPage.tsx # Page for uploading images
│   └── ResultsPage.tsx # Page for displaying results
├── lib/
│   ├── types.ts       # TypeScript types and interfaces
│   ├── api.ts         # API communication functions
│   └── utils.ts       # Utility functions (including image to base64)
├── hooks/
│   └── useImageProcessing.ts # Custom hook for image processing logic
├── app.tsx            # Main application component with routing
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Implementation Steps

### 1. Setup Project Structure
- Create the folder structure as outlined above
- Install required dependencies:
  ```bash
  npm install react-router-dom @types/react-router-dom
  ```
- Set up React Router for navigation between pages

### 2. Create Type Definitions
- Create the Product interface and other necessary types
- Set up server configuration files for API endpoints

### 3. API Integration
- Implement the server configuration module
- Port over the API client for image analysis
- Set up streaming response handling for receiving product objects

### 4. File Upload Page Implementation
- Create a file upload component with drag-and-drop functionality
- Add validation to ensure only image files are accepted
- Implement image preview functionality
- Create utility function to convert uploaded image to base64-encoded PNG
- Add a submit button to process the image

### 5. Results Page Implementation
- Create components to display product information
- Implement logic to construct Amazon search URLs from product names
- Design a clean UI to display product links and information
- Add loading states and error handling

### 6. Navigation and State Management
- Implement routing between upload and results pages
- Set up state management for passing data between pages
- Add navigation controls (back button, retry upload, etc.)

### 7. Integration and Testing
- Connect the upload page to the API client
- Test the streaming response handling
- Ensure proper navigation between pages
- Test error handling and edge cases

## Technical Implementation Details

### Image to Base64 Conversion
```typescript
const convertImageToBase64 = (file: File): Promise<string> => {
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
        resolve(canvas.toDataURL('image/png').split(',')[1]);
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
```

### API Communication
We'll reuse the API client from your existing application:

```typescript
// lib/api.ts
import { Product } from "../types/common";
import { getEndpointUrl } from "./server-config";

interface AnalyzeRequest {
    image: string;
    metadata?: {
        timestamp: string;
    };
}

export interface StreamingCallbacks {
    onProduct: (product: Product) => void;
    onComplete: (response?: unknown) => void;
    onError: (error: Event) => void;
}

/**
 * Sends image data to the server for streaming analysis
 * Uses a workaround to send POST data with EventSource by first initiating the stream
 */
export const analyzeImageStreaming = async (
    imageData: string,
    callbacks: StreamingCallbacks,
    signal?: AbortSignal,
): Promise<void> => {
    // Get the endpoint URL using the server-config helper
    const url = getEndpointUrl('/analyze/stream');

    const request: AnalyzeRequest = {
        image: imageData,
        metadata: {
            timestamp: new Date().toISOString(),
        },
    };

    try {
        // Since EventSource only supports GET, we need to use fetch with streaming response
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "text/event-stream",
                "Cache-Control": "no-cache",
            },
            body: JSON.stringify(request),
            signal: signal,
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        if (!response.body) {
            throw new Error("Response body is null");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        const processStream = async () => {
            try {
                let done = false;
                do {
                    // Check if aborted
                    if (signal?.aborted) {
                        console.log(`[PauseShop:ApiClient] Streaming aborted - cancelling reader`);
                        reader.cancel();
                        throw new DOMException('Operation aborted', 'AbortError');
                    }

                    const { done: currentDone, value } = await reader.read();
                    done = currentDone;

                    if (done) {
                        callbacks.onComplete();
                    } else {
                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split("\n");
                        buffer = lines.pop() || ""; // Keep incomplete line in buffer

                        for (const line of lines) {
                            if (line.trim() === "") continue;

                            if (line.startsWith("event: ")) {
                                continue;
                            }

                            if (line.startsWith("data: ")) {
                                const data = line.substring(6).trim();

                                try {
                                    const parsedData = JSON.parse(data);

                                    // Handle different event types based on the parsed data structure
                                    if (
                                        parsedData.name &&
                                        parsedData.iconCategory &&
                                        parsedData.category
                                    ) {
                                        // This is a product event
                                        callbacks.onProduct(parsedData);
                                    } else if (
                                        parsedData.totalProducts !==
                                        undefined ||
                                        parsedData.processingTime !== undefined
                                    ) {
                                        // This is a complete event
                                        callbacks.onComplete();
                                        return;
                                    } else if (
                                        parsedData.message &&
                                        parsedData.code
                                    ) {
                                        // This is an error event
                                        callbacks.onError(
                                            new Event("server_error"),
                                        );
                                        return;
                                    }
                                } catch (parseError) {
                                    console.error(
                                        "Error parsing streaming data:",
                                        parseError,
                                        "Data:",
                                        data,
                                    );
                                }
                            }
                        }
                    }
                } while (!done);
            } catch (error) {
                // Re-throw AbortError
                if (error instanceof Error && error.name === 'AbortError') {
                    console.warn(`Stream reading aborted`);
                    throw error;
                }
                console.error("Error reading stream:", error);
                callbacks.onError(new Event("stream_error"));
            }
        };

        await processStream();
    } catch (error) {
        // Re-throw AbortError to be handled by the caller
        if (error instanceof Error && error.name === 'AbortError') {
            console.warn(`Streaming analysis aborted during initialization`);
            throw error;
        }
        console.error(
            "Failed to start streaming analysis:",
            error,
        );
        callbacks.onError(new Event("connection_error"));
    }
};
```

And the server configuration:

```typescript
// lib/server-config.ts
// Server environment types
export type ServerEnvironment = 'remote' | 'local';

// Server URLs for different environments
export const SERVER_URLS = {
    remote: 'https://pauseshop-server-rfrxaro25a-uc.a.run.app',
    local: 'http://localhost:3000'
};

// Helper function to get base URL for the current environment
export const getServerBaseUrl = (): string => {
    const serverEnv = (process.env.SERVER_ENV as ServerEnvironment) || 'remote';
    return SERVER_URLS[serverEnv] || SERVER_URLS.remote;
};

// Helper function to get full endpoint URL
export const getEndpointUrl = (endpoint: string): string => {
    const baseUrl = getServerBaseUrl();
    return `${baseUrl}${endpoint}`;
};
```

### Amazon URL Construction
We'll create a utility function to construct Amazon search URLs from product names:

```typescript
// lib/utils.ts
/**
 * Constructs an Amazon search URL from a product name or search string
 * @param product The product object containing name or searchString
 * @returns Amazon search URL
 */
export const constructAmazonSearchUrl = (product: Product): string => {
  // Use the searchString if available, otherwise use the product name
  const searchTerm = product.searchString || product.name;
  const encodedName = encodeURIComponent(searchTerm);
  return `https://www.amazon.com/s?k=${encodedName}`;
};
```

### Product Object Interface
Based on your existing code, the Product interface appears to have the following structure:

```typescript
// lib/types.ts
export interface Product {
  name: string;
  iconCategory: string;
  category: string;
  // We'll add searchString for Amazon URL construction
  searchString?: string;
}
```

## User Flow

1. User visits the website and lands on the upload page
2. User uploads an image (with drag-and-drop or file selection)
3. Image is validated and previewed on the page
4. User submits the image for processing
5. Website shows loading state while communicating with the server
6. As product objects are received from the server:
   - Website transitions to the results page
   - Products are displayed with links to Amazon search results
7. User can click on product links to be directed to Amazon
8. User can go back to upload a new image if desired

## Next Steps

1. Set up the project structure and install necessary dependencies
2. Implement the file upload page with image validation
3. Create the image processing utilities
4. Implement the API communication layer
5. Build the results page with Amazon link generation
6. Connect everything with proper routing and state management
7. Add error handling, loading states, and UI polish
8. Test the complete flow with the server integration