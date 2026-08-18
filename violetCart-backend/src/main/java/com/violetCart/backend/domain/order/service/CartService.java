package com.violetCart.backend.domain.order.service;

import com.violetCart.backend.domain.order.dto.AddToCartRequest;
import com.violetCart.backend.domain.order.dto.CartItemResponse;

import java.util.List;

public interface CartService {

    List<CartItemResponse> getUserCart(Long userId);
    CartItemResponse addToCart(Long userId, AddToCartRequest request);
    void updateQuantity(String cartItemId, Integer quantity);
    void removeItem(String cartItemId);
}
