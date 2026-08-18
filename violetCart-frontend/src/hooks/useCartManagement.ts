import { useState, useCallback } from 'react';
import { cartService } from '@/api/cartService';
import type { CartItemResponse, AddToCartRequest } from '@/components/storefront/types';

export const useCartManagement = () => {
    const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCart = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await cartService.getCart();
            setCartItems(response.data);
        } catch (err) {
            setError('Failed to fetch cart');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addItemToCart = async (request: AddToCartRequest) => {
        setError(null);
        try {
            await cartService.addToCart(request);
            await fetchCart();
        } catch (err) {
            setError('Failed to add item to cart');
        }
    };

    const updateItemQuantity = async (cartItemId: string, quantity: number) => {
        setError(null);
        try {
            await cartService.updateQuantity(cartItemId, quantity);
            await fetchCart();
        } catch (err) {
            setError('Failed to update quantity');
        }
    };

    const removeItem = async (cartItemId: string) => {
        setError(null);
        try {
            await cartService.removeItem(cartItemId);
            await fetchCart();
        } catch (err) {
            setError('Failed to remove item');
        }
    };

    return {
        cartItems,
        isLoading,
        error,
        fetchCart,
        addItemToCart,
        updateItemQuantity,
        removeItem
    };
};
