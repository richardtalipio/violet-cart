package com.violetCart.backend.domain.order.controller;

import com.violetCart.backend.common.response.ApiResponse;
import com.violetCart.backend.domain.order.dto.CheckoutRequest;
import com.violetCart.backend.domain.order.dto.CheckoutResponse;
import com.violetCart.backend.domain.order.dto.OrderResponse;
import com.violetCart.backend.domain.order.service.OrderService;
import com.violetCart.backend.domain.user.entity.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<CheckoutResponse>> processCheckout(
            @RequestBody CheckoutRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        CheckoutResponse response = orderService.processCheckout(request, currentUser.getId());

        ApiResponse<CheckoutResponse> apiResponse = ApiResponse.success(
                response.getMessage(),
                response
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getUserOrders(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        List<OrderResponse> orders = orderService.getOrdersByUserAccountId(currentUser.getId());

        ApiResponse<List<OrderResponse>> apiResponse = ApiResponse.success(
                "Orders retrieved successfully",
                orders
        );

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @PathVariable String orderId,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        OrderResponse order = orderService.getOrderById(orderId, currentUser.getId());

        ApiResponse<OrderResponse> apiResponse = ApiResponse.success(
                "Order details retrieved successfully",
                order
        );

        return ResponseEntity.ok(apiResponse);
    }
}