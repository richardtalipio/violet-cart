package com.violetCart.backend.domain.order.controller;

import com.violetCart.backend.common.response.ApiResponse;
import com.violetCart.backend.domain.order.dto.*;
import com.violetCart.backend.domain.order.service.OrderService;
import com.violetCart.backend.domain.product.dto.RetrieveProductResponse;
import com.violetCart.backend.domain.user.entity.CustomUserDetails;
import com.violetCart.backend.domain.user.entity.Role;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
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
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getOrders(
            @ModelAttribute OrderSearchCriteria criteria,
            @PageableDefault(size = 10, sort = "orderDate", direction = Sort.Direction.ASC) Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        Page<OrderResponse> orders = orderService.getOrders(criteria, pageable, currentUser);

        ApiResponse<Page<OrderResponse>> apiResponse = ApiResponse.success(
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

    @PatchMapping("/{orderId}/status")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable String orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        OrderResponse response = orderService.updateOrderStatus(orderId, request.getStatus(), currentUser);

        ApiResponse<OrderResponse> apiResponse = ApiResponse.success(
                "Order status updated successfully",
                response
        );

        return ResponseEntity.ok(apiResponse);
    }

}