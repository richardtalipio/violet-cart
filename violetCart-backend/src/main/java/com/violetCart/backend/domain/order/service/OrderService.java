package com.violetCart.backend.domain.order.service;

import com.violetCart.backend.domain.order.dto.*;
import com.violetCart.backend.domain.order.entity.Order;
import com.violetCart.backend.domain.user.entity.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {

    /**
     * Processes checkout, performs atomic inventory deduction/reservation,
     * and creates the order in the database.
     */
    CheckoutResponse processCheckout(CheckoutRequest request, Long userAccountId);

    OrderResponse getOrderById(String orderId, Long userAccountId);

    Page<OrderResponse> getOrders(OrderSearchCriteria criteria, Pageable pageable, CustomUserDetails  customUserDetails);

    OrderResponse updateOrderStatus(String orderId, OrderStatus newStatus, CustomUserDetails customUserDetails);
}