// hooks/useWishlist.js
import { useState, useEffect, useCallback } from 'react';

const useWishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load wishlist from localStorage on mount
    useEffect(() => {
        try {
            const savedWishlist = localStorage.getItem('wishlist');
            if (savedWishlist) {
                setWishlistItems(JSON.parse(savedWishlist));
            }
        } catch (error) {
            console.error('Error loading wishlist from localStorage:', error);
            setError('Failed to load wishlist');
        } finally {
            setIsInitialized(true);
        }
    }, []);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
      if (!isInitialized) {
            console.log('⏸️ Skipping save - not initialized yet');
            return; // Skip saving during initialization
        }

        try {
            localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
        } catch (error) {
            console.error('Error saving wishlist to localStorage:', error);
            setError('Failed to save wishlist');
        }
    }, [wishlistItems, isInitialized]);

    // Check if a product is in wishlist
    const isInWishlist = useCallback((productId) => {
        return wishlistItems.some(item => item.id === productId);
    }, [wishlistItems]);

    // Add product to wishlist
    const addToWishlist = useCallback(async (product) => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call delay (remove this in production)
            await new Promise(resolve => setTimeout(resolve, 500));

            setWishlistItems(prevItems => {
                // Check if product already exists
                if (prevItems.some(item => item.id === product.id)) {
                    return prevItems; // Don't add duplicate
                }
                return [...prevItems, {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    category: product.category,
                    addedAt: new Date().toISOString()
                }];
            });

            // Optional: Show success notification
            console.log('Product added to wishlist:', product.title);
            
        } catch (error) {
            setError('Failed to add to wishlist');
            console.error('Error adding to wishlist:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Remove product from wishlist
    const removeFromWishlist = useCallback(async (productId) => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call delay (remove this in production)
            await new Promise(resolve => setTimeout(resolve, 500));

            setWishlistItems(prevItems => 
                prevItems.filter(item => item.id !== productId)
            );

            localStorage.setItem('wishlist', JSON.stringify(wishlistItems));

            console.log('Product removed from wishlist');
            
        } catch (error) {
            setError('Failed to remove from wishlist');
            console.error('Error removing from wishlist:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Toggle product in wishlist
    const toggleWishlist = useCallback(async (product) => {
        if (isInWishlist(product.id)) {
            await removeFromWishlist(product.id);
        } else {
            await addToWishlist(product);
        }
    }, [isInWishlist, addToWishlist, removeFromWishlist]);

    // Clear entire wishlist
    const clearWishlist = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            setWishlistItems([]);
            console.log('Wishlist cleared');
        } catch (error) {
            setError('Failed to clear wishlist');
            console.error('Error clearing wishlist:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Get wishlist count
    const wishlistCount = wishlistItems.length;

    return {
        // State
        wishlistItems,
        wishlistCount,
        isLoading,
        error,
        
        // Actions
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        isInWishlist,
        
        // Utilities
        setError // For clearing errors manually
    };
};

export default useWishlist;