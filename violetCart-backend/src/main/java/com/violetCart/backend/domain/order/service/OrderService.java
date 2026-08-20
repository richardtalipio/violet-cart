package com.violetCart.backend.domain.order.service;

import com.violetCart.backend.domain.order.dto.CheckoutRequest;
import com.violetCart.backend.domain.order.dto.CheckoutResponse;
import com.violetCart.backend.domain.order.dto.OrderResponse;

import java.util.List;

public interface OrderService {

    /**
     * Processes checkout, performs atomic inventory deduction/reservation,
     * and creates the order in the database.
     */
    CheckoutResponse processCheckout(CheckoutRequest request, Long userAccountId);

    List<OrderResponse> getOrdersByUserAccountId(Long userAccountId);

    OrderResponse getOrderById(String orderId, Long userAccountId);
}