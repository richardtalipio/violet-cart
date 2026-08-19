package com.violetCart.backend.domain.order.service;

import com.violetCart.backend.domain.order.dto.CheckoutRequest;
import com.violetCart.backend.domain.order.dto.CheckoutResponse;

public interface OrderService {

    /**
     * Processes checkout, performs atomic inventory deduction/reservation,
     * and creates the order in the database.
     */
    CheckoutResponse processCheckout(CheckoutRequest request);
}