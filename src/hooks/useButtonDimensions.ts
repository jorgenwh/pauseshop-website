import { useState, useEffect, useRef } from 'react';

interface ButtonDimensions {
    originalWidth: number;
    deepSearchWidth: number;
    deepSearchLeft: number;
}

export const useButtonDimensions = (isRanking: boolean, rankingResultsLength: number) => {
    const originalItemsButtonRef = useRef<HTMLButtonElement>(null);
    const deepSearchButtonRef = useRef<HTMLButtonElement>(null);
    const [buttonDimensions, setButtonDimensions] = useState<ButtonDimensions>({
        originalWidth: 112,
        deepSearchWidth: 96,
        deepSearchLeft: 128
    });

    // Calculate button dimensions for light bar positioning
    useEffect(() => {
        const updateButtonDimensions = () => {
            if (originalItemsButtonRef.current && deepSearchButtonRef.current) {
                const originalRect = originalItemsButtonRef.current.getBoundingClientRect();
                const deepSearchRect = deepSearchButtonRef.current.getBoundingClientRect();
                const containerRect = originalItemsButtonRef.current.parentElement?.getBoundingClientRect();

                if (containerRect) {
                    setButtonDimensions({
                        originalWidth: originalRect.width,
                        deepSearchWidth: deepSearchRect.width,
                        deepSearchLeft: deepSearchRect.left - containerRect.left
                    });
                }
            }
        };

        // Update dimensions after component mounts and when text changes
        const timer = setTimeout(updateButtonDimensions, 100);
        return () => clearTimeout(timer);
    }, [isRanking, rankingResultsLength]); // Re-calculate when button text might change

    return {
        originalItemsButtonRef,
        deepSearchButtonRef,
        buttonDimensions,
    };
};
