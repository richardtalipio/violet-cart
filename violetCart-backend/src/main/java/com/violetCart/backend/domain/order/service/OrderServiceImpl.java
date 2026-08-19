package com.violetCart.backend.domain.order.service;

import com.violetCart.backend.domain.order.dto.CheckoutRequest;
import com.violetCart.backend.domain.order.dto.CheckoutResponse;
import com.violetCart.backend.domain.order.dto.OrderStatus;
import com.violetCart.backend.domain.order.dto.PaymentMethod;
import com.violetCart.backend.domain.order.entity.Order;
import com.violetCart.backend.domain.order.entity.OrderItem;
import com.violetCart.backend.domain.order.repository.InventoryRepository;
import com.violetCart.backend.domain.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;

    private static final int EXPIRATION_MINUTES = 15;

    @Override
    @Transactional
    public CheckoutResponse processCheckout(CheckoutRequest request) {

        // 1. Validate Inventory & Perform Atomic Stock Reservation/Deduction
        for (CheckoutRequest.CheckoutItemDto item : request.getItems()) {
            int updatedRows = (request.getPaymentMethod() == PaymentMethod.COD)
                    ? inventoryRepository.deductStockDirectly(item.getProductId(), item.getQuantity())
                    : inventoryRepository.reserveStock(item.getProductId(), item.getQuantity());

            if (updatedRows == 0) {
                throw new IllegalStateException(
                        "Stock checkout failed. Item '" + item.getProductName() + "' is out of stock or quantity unavailable."
                );
            }
        }

        // 2. Calculate Order Totals
        BigDecimal subtotal = request.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal shippingFee = request.getShippingFee() != null ? request.getShippingFee() : BigDecimal.ZERO;
        BigDecimal total = subtotal.add(shippingFee);

        // 3. Determine Initial Status and Expiration
        boolean isCod = request.getPaymentMethod() == PaymentMethod.COD;
        OrderStatus initialStatus = isCod ? OrderStatus.TO_SHIP : OrderStatus.PENDING_PAYMENT;
        LocalDateTime expiresAt = isCod ? null : LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES);

        // 4. Build Primary Order Entity using Builder
        String orderId = UUID.randomUUID().toString();

        Order order = Order.builder()
                .id(orderId)
                .userAccountId(request.getUserAccountId())
                .customerName(request.getCustomerName())
                .orderDate(LocalDateTime.now())
                .orderStatus(initialStatus)
                .paymentMethod(request.getPaymentMethod())
                .expiresAt(expiresAt)
                .shippingAddress(request.getShippingAddress())
                .subtotal(subtotal)
                .shippingFee(shippingFee)
                .total(total)
                .build();

        // 5. Map OrderItem DTOs to OrderItem Entities using Builder
        List<OrderItem> orderItems = request.getItems().stream()
                .map(itemDto -> OrderItem.builder()
                        .id(UUID.randomUUID().toString())
                        .order(order)
                        .productId(itemDto.getProductId())
                        .productName(itemDto.getProductName())
                        .imageUrl(itemDto.getImageUrl())
                        .price(itemDto.getPrice())
                        .quantity(itemDto.getQuantity())
                        .build())
                .toList();

        order.setOrderItems(orderItems);

        // 6. Save Order Entity
        orderRepository.save(order);

        // 7. Construct & Return Response using Builder
        String responseMessage = isCod
                ? "Order placed successfully."
                : "Order created. Please complete payment within " + EXPIRATION_MINUTES + " minutes.";

        return CheckoutResponse.builder()
                .orderId(orderId)
                .orderStatus(initialStatus)
                .paymentMethod(request.getPaymentMethod())
                .totalAmount(total)
                .expiresAt(expiresAt)
                .message(responseMessage)
                .build();
    }
}