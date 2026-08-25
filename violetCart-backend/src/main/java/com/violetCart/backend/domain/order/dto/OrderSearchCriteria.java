package com.violetCart.backend.domain.order.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderSearchCriteria {

    private String customerName;
    private OrderStatus orderStatus;
    private Long userAccountId;
}
