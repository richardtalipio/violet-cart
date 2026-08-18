package com.violetCart.backend.domain.order.dto;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class AddToCartRequest {
    private Long productId;
    private Integer quantity;
}