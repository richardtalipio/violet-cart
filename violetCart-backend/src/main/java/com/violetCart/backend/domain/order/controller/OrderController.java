package com.violetCart.backend.domain.order.controller;

import com.violetCart.backend.common.response.ApiResponse;
import com.violetCart.backend.domain.order.dto.CheckoutRequest;
import com.violetCart.backend.domain.order.dto.CheckoutResponse;
import com.violetCart.backend.domain.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<CheckoutResponse>> processCheckout(@RequestBody CheckoutRequest request) {
        CheckoutResponse response = orderService.processCheckout(request);

        ApiResponse<CheckoutResponse> apiResponse = ApiResponse.success(
                response.getMessage(),
                response
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }
}
