package com.violetCart.backend.domain.cart.service;

import com.violetCart.backend.domain.cart.dto.AddToCartRequest;
import com.violetCart.backend.domain.cart.dto.CartItemResponse;
import com.violetCart.backend.domain.cart.entity.CartItem;
import com.violetCart.backend.domain.cart.repository.CartItemRepository;
import com.violetCart.backend.domain.product.entity.Product;
import com.violetCart.backend.domain.product.repository.ProductRepository;
import com.violetCart.backend.domain.user.entity.UserAccount;
import com.violetCart.backend.domain.user.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserAccountRepository userRepository;

    @Transactional(readOnly = true)
    public List<CartItemResponse> getUserCart(Long userId) {
        return cartItemRepository.findByUserAccountId(userId).stream()
                .map(item -> CartItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getProductName())
                        .imageUrl(item.getProduct().getImageUrl())
                        .price(item.getProduct().getPrice())
                        .quantity(item.getQuantity())
                        .subtotal(computeSubtotal(item.getQuantity(), item.getProduct().getPrice()))
                        .build()) // Removed semicolon here
                .collect(Collectors.toList());
    }

    @Transactional
    public CartItemResponse addToCart(Long userId, AddToCartRequest request) {
        UserAccount user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        CartItem cartItem = cartItemRepository
                .findByUserAccountIdAndProductId(userId, request.getProductId())
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + request.getQuantity());
                    return existing;
                })
                .orElseGet(() -> CartItem.builder()
                        .id("CART-" + UUID.randomUUID().toString().substring(0, 8))
                        .userAccount(user)
                        .product(product)
                        .quantity(request.getQuantity())
                        .build());

        CartItem saved = cartItemRepository.save(cartItem);

        CartItemResponse cartItemResponse = CartItemResponse.builder()
                .id(saved.getId())
                .productId(product.getId())
                .productName(product.getProductName())
                .imageUrl(product.getImageUrl())
                .price(product.getPrice())
                .quantity(saved.getQuantity())
                .subtotal(computeSubtotal(saved.getQuantity(), product.getPrice() )).build();
        return cartItemResponse;
    }

    @Transactional
    public void updateQuantity(String cartItemId, Integer quantity) {
        if (quantity <= 0) {
            cartItemRepository.deleteById(cartItemId);
        } else {
            cartItemRepository.findById(cartItemId).ifPresent(item -> {
                item.setQuantity(quantity);
                cartItemRepository.save(item);
            });
        }
    }

    @Transactional
    public void removeItem(String cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    private BigDecimal computeSubtotal(Integer quantity, BigDecimal price) {
        return price.multiply(BigDecimal.valueOf(quantity));
    }
}
