package com.violetCart.backend.domain.product.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSearchCriteria {

    private String productName;
    private String category;

}
