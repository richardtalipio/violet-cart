package com.violetCart.backend.domain.order.controller;

import com.violetCart.backend.common.response.ApiResponse;
import com.violetCart.backend.domain.order.dto.AddToCartRequest;
import com.violetCart.backend.domain.order.dto.CartItemResponse;
import com.violetCart.backend.domain.order.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CartItemResponse>>> getCart(@RequestParam Long userId) {
        return ResponseEntity.ok(
                ApiResponse.success("Cart items successfully retrieved", cartService.getUserCart(userId))
        );
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartItemResponse>> addToCart(
            @RequestParam Long userId,
            @RequestBody AddToCartRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success("Item successfully added to cart", cartService.addToCart(userId, request))
        );
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<ApiResponse<Void>> updateQuantity(
            @PathVariable String cartItemId,
            @RequestParam Integer quantity
    ) {
        cartService.updateQuantity(cartItemId, quantity);
        return ResponseEntity.ok(
                ApiResponse.success("Cart item quantity updated successfully", null)
        );
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<ApiResponse<Void>> removeItem(@PathVariable String cartItemId) {
        cartService.removeItem(cartItemId);
        return ResponseEntity.ok(
                ApiResponse.success("Item successfully removed from cart", null)
        );
    }
}