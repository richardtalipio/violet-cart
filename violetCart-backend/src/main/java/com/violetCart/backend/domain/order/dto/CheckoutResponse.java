package com.violetCart.backend.domain.order.dto;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class CheckoutResponse {
    private String orderId;
    private OrderStatus orderStatus;
    private PaymentMethod paymentMethod;
    private BigDecimal totalAmount;
    private LocalDateTime expiresAt;
    private String message;
}
