/**
 * Custom hook for handling image processing and API communication
 */

import { useState, useCallback, useRef } from 'react';
import { analyzeImageStreaming, StreamingCallbacks } from '../../../lib/api/client';
import { convertImageToBase64 } from '../../../lib/utils';
import { Product } from '../../../lib/types';
import { UPLOAD_CONFIG } from '../../../lib/constants';

interface ImageProcessingState {
    isLoading: boolean;
    error: string | null;
    products: Product[];
    selectedFile: File | null;
    previewUrl: string | null;
    analysisCompleted: boolean;
}

interface UseImageProcessingReturn {
    isLoading: boolean;
    error: string | null;
    products: Product[];
    selectedFile: File | null;
    previewUrl: string | null;
    analysisCompleted: boolean;
    handleFileSelect: (file: File) => string;
    clearPreview: () => void;
    processImage: () => Promise<void>;
    cancelProcessing: () => void;
    reset: () => void;
}

export const useImageProcessing = (): UseImageProcessingReturn => {
    const [state, setState] = useState<ImageProcessingState>({
        isLoading: false,
        error: null,
        products: [],
        selectedFile: null,
        previewUrl: null,
        analysisCompleted: false,
    });

    const abortControllerRef = useRef<AbortController | null>(null);

    // Handle file selection
    const handleFileSelect = useCallback((file: File) => {
        // Create a preview URL for the selected file
        const previewUrl = URL.createObjectURL(file);

        setState(prev => ({
            ...prev,
            selectedFile: file,
            previewUrl,
            error: null,
            analysisCompleted: false,
        }));

        return previewUrl;
    }, []);

    // Clean up preview URL when component unmounts or when a new file is selected
    const clearPreview = useCallback(() => {
        if (state.previewUrl) {
            URL.revokeObjectURL(state.previewUrl);
        }

        setState(prev => ({
            ...prev,
            previewUrl: null,
        }));
    }, [state.previewUrl]);

    // Process the selected image
    const processImage = useCallback(async () => {
        if (!state.selectedFile) {
            setState(prev => ({
                ...prev,
                error: 'No file selected',
            }));
            return;
        }

        setState(prev => ({
            ...prev,
            isLoading: true,
            error: null,
            products: [],
            analysisCompleted: false,
        }));

        try {
            // Convert the image to base64 with size limit
            const base64Image = await convertImageToBase64(state.selectedFile, UPLOAD_CONFIG.maxSizeMB);

            // Create a new AbortController for this request
            abortControllerRef.current = new AbortController();

            // Define callbacks for the streaming response
            const callbacks: StreamingCallbacks = {
                onProduct: (product: Product) => {
                    setState(prev => ({
                        ...prev,
                        products: [...prev.products, product],
                    }));
                },
                onComplete: () => {
                    setState(prev => ({
                        ...prev,
                        isLoading: false,
                        analysisCompleted: true,
                    }));
                },
                onError: (error: Event) => {
                    // Check if it's a CustomEvent with detail
                    const errorDetail = 'detail' in error ? (error as CustomEvent).detail : null;
                    
                    // Create user-friendly error messages based on error type
                    let errorMessage = '';
                    
                    switch(error.type) {
                        case 'image_error':
                            errorMessage = `Image Error: The image format is not valid. Please make sure you're uploading a supported image format (PNG, JPG, JPEG, WebP, AVIF).`;
                            break;
                        case 'processing_error':
                            errorMessage = `Processing Error: There was a problem analyzing your image. Please try again with a clearer image.`;
                            break;
                        case 'rate_limit_error':
                            errorMessage = `Rate Limit Exceeded: You've made too many requests. Please try again later.`;
                            break;
                        case 'connection_error':
                            errorMessage = `Connection Error: Could not connect to the server. Please check your internet connection and try again.`;
                            break;
                        case 'stream_error':
                            errorMessage = `Stream Error: The connection was interrupted. Please try again.`;
                            break;
                        default:
                            errorMessage = errorDetail 
                                ? `${error.type}: ${errorDetail}`
                                : error.type || 'An error occurred during processing';
                    }
                    
                    // Error is already handled by displaying it to the user
                    
                    setState(prev => ({
                        ...prev,
                        isLoading: false,
                        error: errorMessage,
                    }));
                },
            };

            // Send the image to the server
            await analyzeImageStreaming(
                base64Image,
                callbacks,
                abortControllerRef.current.signal
            );
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'An unknown error occurred',
            }));
        }
    }, [state.selectedFile]);

    // Cancel ongoing requests
    const cancelProcessing = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;

            setState(prev => ({
                ...prev,
                isLoading: false,
            }));
        }
    }, []);

    // Reset the state
    const reset = useCallback(() => {
        cancelProcessing();
        clearPreview();

        setState({
            isLoading: false,
            error: null,
            products: [],
            selectedFile: null,
            previewUrl: null,
            analysisCompleted: false,
        });
    }, [cancelProcessing, clearPreview]);

    return {
        isLoading: state.isLoading,
        error: state.error,
        products: state.products,
        selectedFile: state.selectedFile,
        previewUrl: state.previewUrl,
        analysisCompleted: state.analysisCompleted,
        handleFileSelect,
        clearPreview,
        processImage,
        cancelProcessing,
        reset,
    };
};
