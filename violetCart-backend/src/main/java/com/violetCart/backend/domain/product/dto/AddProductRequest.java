package com.violetCart.backend.domain.product.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class AddProductRequest {
    private String imageUrl;
    private String productName;
    private BigDecimal price;
    private int stocksLeft;
    private String category;
    private String description;

}
