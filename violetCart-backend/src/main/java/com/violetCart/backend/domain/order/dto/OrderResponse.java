package com.violetCart.backend.domain.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private String id;
    private Long userAccountId;
    private String customerName;
    private LocalDateTime orderDate;
    private OrderStatus orderStatus;
    private PaymentMethod paymentMethod;
    private LocalDateTime expiresAt;
    private Object shippingAddress; // Use your actual ShippingAddress entity/embeddable type here
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal total;
    private List<OrderItemDto> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDto {
        private String id;
        private Long productId;
        private String productName;
        private String imageUrl;
        private BigDecimal price;
        private Integer quantity;
    }
}
