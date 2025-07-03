import { useState, useEffect } from 'react';

export const useLoadingDots = (condition: boolean) => {
    const [loadingDots, setLoadingDots] = useState('.');

    useEffect(() => {
        if (!condition) {
            const interval = setInterval(() => {
                setLoadingDots(prev => (prev === '...' ? '.' : prev + '.'));
            }, 500);
            return () => clearInterval(interval);
        }
    }, [condition]);

    return loadingDots;
};
