import { useState, useEffect } from 'react';
import { getScreenshot } from '../lib/api';
import { getExtensionData } from '../lib/browser-extensions';
import { Product, AmazonProduct, ExtensionClickHistoryEntry } from '../lib/types';
import { TEXT } from '../lib/constants';

interface ExtensionDataState {
    imageUrl: string | null;
    product: Product | null;
    amazonProducts: AmazonProduct[];
    clickHistory: ExtensionClickHistoryEntry[];
    selectedProductIndex: number;
    screenshotError: string | null;
    pauseId: string | null;
}

export const useExtensionData = () => {
    const [state, setState] = useState<ExtensionDataState>({
        imageUrl: null,
        product: null,
        amazonProducts: [],
        clickHistory: [],
        selectedProductIndex: 0,
        screenshotError: null,
        pauseId: null,
    });

    const updateHistoryItem = async (item: ExtensionClickHistoryEntry) => {
        // Set the new product and amazon products
        const newProduct = item.productGroup.product;
        const newAmazonProducts = item.productGroup.scrapedProducts;

        // Find the index of the clicked product
        const clickedIndex = newAmazonProducts.findIndex(p => p.id === item.clickedProduct.id);
        const newSelectedIndex = clickedIndex !== -1 ? clickedIndex : 0;

        // Update the pauseId
        const newPauseId = item.pauseId;

        // Refresh click history from extension to get latest deep search data
        const extensionData = await getExtensionData();
        const refreshedClickHistory = extensionData?.clickHistory || [];

        // Fetch and set the new screenshot
        setState(prev => ({ ...prev, imageUrl: null, screenshotError: null }));
        
        try {
            const screenshotUrl = await getScreenshot(newPauseId);
            
            if (screenshotUrl) {
                setState(prev => ({
                    ...prev,
                    product: newProduct,
                    amazonProducts: newAmazonProducts,
                    selectedProductIndex: newSelectedIndex,
                    pauseId: newPauseId,
                    imageUrl: screenshotUrl,
                    clickHistory: refreshedClickHistory,
                }));
            } else {
                // Screenshot not found or failed to fetch
                setState(prev => ({
                    ...prev,
                    product: newProduct,
                    amazonProducts: newAmazonProducts,
                    selectedProductIndex: newSelectedIndex,
                    pauseId: newPauseId,
                    screenshotError: TEXT.screenshotExpired,
                    clickHistory: refreshedClickHistory,
                }));
            }
        } catch {
            // Screenshot fetch failed - this is expected when screenshots expire
            setState(prev => ({
                ...prev,
                product: newProduct,
                amazonProducts: newAmazonProducts,
                selectedProductIndex: newSelectedIndex,
                pauseId: newPauseId,
                screenshotError: TEXT.screenshotExpired,
                clickHistory: refreshedClickHistory,
            }));
        }
    };

    const setScreenshotError = (error: string | null) => {
        setState(prev => ({ ...prev, screenshotError: error }));
    };

    const updateClickHistory = (updatedHistory: ExtensionClickHistoryEntry[]) => {
        setState(prev => ({ ...prev, clickHistory: updatedHistory }));
    };

    useEffect(() => {
        const fetchExtensionData = async () => {
            const extensionData = await getExtensionData();

            if (extensionData?.clickHistory) {
                setState(prev => ({ ...prev, clickHistory: extensionData.clickHistory || [] }));
            }

            if (!extensionData?.productStorage || !extensionData.clickedProduct) {
                return;
            }

            const { pauseId: storagePauseId, productGroups } = extensionData.productStorage;
            const clickedProduct = extensionData.clickedProduct;

            let screenshotUrl: string | null = null;
            if (storagePauseId) {
                try {
                    screenshotUrl = await getScreenshot(storagePauseId);
                } catch {
                    // Screenshot fetch failed - this is expected when screenshots expire
                    setState(prev => ({ ...prev, screenshotError: "Could not load the screenshot." }));
                }
            }

            // Find the product group that contains the clicked product
            const targetGroup = productGroups.find(pg => pg.scrapedProducts.some(p => p.id === clickedProduct.id));

            // Fallback to the first group if the target isn't found, though it should not happen.
            const activeGroup = targetGroup || (productGroups.length > 0 ? productGroups[0] : null);

            if (activeGroup) {
                const mainProduct = activeGroup.product;
                const activeAmazonProducts = activeGroup.scrapedProducts;
                const clickedIndex = activeAmazonProducts.findIndex(p => p.id === clickedProduct.id);

                // Set state together
                setState(prev => ({
                    ...prev,
                    pauseId: storagePauseId,
                    imageUrl: screenshotUrl,
                    product: mainProduct,
                    amazonProducts: activeAmazonProducts,
                    selectedProductIndex: clickedIndex !== -1 ? clickedIndex : 0,
                }));
            }
        };

        fetchExtensionData();
    }, []);

    return {
        ...state,
        updateHistoryItem,
        setScreenshotError,
        updateClickHistory,
    };
};
