package com.violetCart.backend.domain.product.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RetrieveProductResponse {
    private Long id;
    private String imageUrl;
    private String productName;
    private BigDecimal price;
    private Integer stockQuantity;
    private Double rating;
    private String category;
    private String description;

}
