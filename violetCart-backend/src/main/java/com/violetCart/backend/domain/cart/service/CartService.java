package com.violetCart.backend.domain.cart.service;

import com.violetCart.backend.domain.cart.dto.AddToCartRequest;
import com.violetCart.backend.domain.cart.dto.CartItemResponse;

import java.util.List;

public interface CartService {

    List<CartItemResponse> getUserCart(Long userId);
    CartItemResponse addToCart(Long userId, AddToCartRequest request);
    void updateQuantity(String cartItemId, Integer quantity);
    void removeItem(String cartItemId);
}
