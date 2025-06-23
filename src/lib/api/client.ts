/**
 * API client for server communication
 * Handles HTTP requests to the backend server
 */

import { Product } from "../types";
import { getEndpointUrl } from "./endpoints";

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

// Original code without server connection test

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

    // Simplify the request to match exactly what the server expects
    const request = {
        image: imageData
    };

    try {
        // Make sure we're sending the correct format
        console.log("Sending request to:", url);
        console.log("Request format:", {
            image: request.image.substring(0, 50) + "..." // Just log the beginning of the image data
        });
        
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
        
        console.log("Response status:", response.status, response.statusText);

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
                console.log("Starting to process stream...");
                let done = false;
                do {
                    // Check if aborted
                    if (signal?.aborted) {
                        console.log(`Streaming aborted - cancelling reader`);
                        reader.cancel();
                        throw new DOMException('Operation aborted', 'AbortError');
                    }

                    const { done: currentDone, value } = await reader.read();
                    done = currentDone;

                    if (done) {
                        console.log("Stream done, completing");
                        callbacks.onComplete();
                    } else {
                        const chunk = decoder.decode(value, { stream: true });
                        console.log("Received chunk:", chunk);
                        buffer += chunk;
                        const lines = buffer.split("\n");
                        buffer = lines.pop() || ""; // Keep incomplete line in buffer

                        console.log(`Processing ${lines.length} lines from buffer`);
                        
                        for (const line of lines) {
                            if (line.trim() === "") {
                                console.log("Skipping empty line");
                                continue;
                            }

                            console.log("Processing line:", line);
                            
                            if (line.startsWith("event: ")) {
                                console.log("Found event type:", line.substring(7).trim());
                                continue;
                            }

                            if (line.startsWith("data: ")) {
                                const data = line.substring(6).trim();
                                console.log("Found data:", data);

                                try {
                                    const parsedData = JSON.parse(data);
                                    console.log("Parsed data:", parsedData);

                                    // Handle different event types based on the parsed data structure
                                    if (
                                        parsedData.name &&
                                        parsedData.iconCategory &&
                                        parsedData.category
                                    ) {
                                        // This is a product event
                                        console.log("Found product data");
                                        callbacks.onProduct(parsedData);
                                    } else if (
                                        parsedData.totalProducts !==
                                        undefined ||
                                        parsedData.processingTime !== undefined
                                    ) {
                                        // This is a complete event
                                        console.log("Found completion data");
                                        callbacks.onComplete();
                                        return;
                                    } else if (
                                        parsedData.message &&
                                        parsedData.code
                                    ) {
                                        // This is an error event
                                        console.error("Found error data:", parsedData.message, parsedData.code);
                                        
                                        // Create a more specific error type based on the error code
                                        let errorType = "server_error";
                                        if (parsedData.code === "INVALID_IMAGE") {
                                            errorType = "image_error";
                                        } else if (parsedData.code === "PROCESSING_ERROR") {
                                            errorType = "processing_error";
                                        } else if (parsedData.code === "RATE_LIMIT_EXCEEDED") {
                                            errorType = "rate_limit_error";
                                        }
                                        
                                        const errorEvent = new CustomEvent(errorType, {
                                            detail: `${parsedData.code}: ${parsedData.message}`
                                        });
                                        callbacks.onError(errorEvent);
                                        return;
                                    } else {
                                        console.log("Unknown data format:", parsedData);
                                    }
                                } catch (parseError) {
                                    console.error(
                                        "Error parsing streaming data:",
                                        parseError,
                                        "Data:",
                                        data,
                                    );
                                }
                            } else {
                                console.warn("Line doesn't start with 'data:':", line);
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
