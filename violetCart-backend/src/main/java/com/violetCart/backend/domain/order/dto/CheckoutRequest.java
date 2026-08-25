package com.violetCart.backend.domain.order.dto;
import com.violetCart.backend.domain.order.entity.ShippingAddress;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {
    private String customerName;
    private PaymentMethod paymentMethod;
    private ShippingAddress shippingAddress;
    private BigDecimal shippingFee;
    private List<CheckoutItemDto> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CheckoutItemDto {
        private Long storeProfileId;
        private Long productId;
        private String productName;
        private String imageUrl;
        private BigDecimal price;
        private Integer quantity;
    }
}