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
                        reader.cancel();
                        throw new DOMException('Operation aborted', 'AbortError');
                    }

                    const { done: currentDone, value } = await reader.read();
                    done = currentDone;

                    if (done) {
                        callbacks.onComplete();
                    } else {
                        const chunk = decoder.decode(value, { stream: true });
                        buffer += chunk;
                        const lines = buffer.split("\n");
                        buffer = lines.pop() || ""; // Keep incomplete line in buffer
                        
                        for (const line of lines) {
                            if (line.trim() === "") {
                                continue;
                            }
                            
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
                                    }
                                } catch (parseError) {
                                    // Silent fail for parse errors
                                }
                            }
                        }
                    }
                } while (!done);
            } catch (error) {
                // Re-throw AbortError
                if (error instanceof Error && error.name === 'AbortError') {
                    throw error;
                }
                callbacks.onError(new Event("stream_error"));
            }
        };

        await processStream();
    } catch (error) {
        // Re-throw AbortError to be handled by the caller
        if (error instanceof Error && error.name === 'AbortError') {
            throw error;
        }
        
        callbacks.onError(new Event("connection_error"));
    }
};
