/**
 * Custom hook for handling image processing and API communication
 */

import { useState, useCallback, useRef } from 'react';
import { analyzeImageStreaming, StreamingCallbacks } from '../lib/api';
import { convertImageToBase64 } from '../lib/utils';
import { Product } from '../lib/types';

interface ImageProcessingState {
  isLoading: boolean;
  error: string | null;
  products: Product[];
  selectedFile: File | null;
  previewUrl: string | null;
}

export const useImageProcessing = () => {
  const [state, setState] = useState<ImageProcessingState>({
    isLoading: false,
    error: null,
    products: [],
    selectedFile: null,
    previewUrl: null,
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
    }));

    try {
      // Convert the image to base64
      const base64Image = await convertImageToBase64(state.selectedFile);
      
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
          }));
        },
        onError: (error: Event) => {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: error.type || 'An error occurred during processing',
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
    });
  }, [cancelProcessing, clearPreview]);

  return {
    ...state,
    handleFileSelect,
    clearPreview,
    processImage,
    cancelProcessing,
    reset,
  };
};

export default useImageProcessing;