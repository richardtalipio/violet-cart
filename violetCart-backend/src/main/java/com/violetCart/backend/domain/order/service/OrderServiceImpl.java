package com.violetCart.backend.domain.order.service;

import com.violetCart.backend.domain.inventory.repository.InventoryRepository;
import com.violetCart.backend.domain.order.dto.CheckoutRequest;
import com.violetCart.backend.domain.order.dto.CheckoutResponse;
import com.violetCart.backend.domain.order.dto.OrderResponse;
import com.violetCart.backend.domain.order.dto.OrderStatus;
import com.violetCart.backend.domain.order.dto.PaymentMethod;
import com.violetCart.backend.domain.order.entity.Order;
import com.violetCart.backend.domain.order.entity.OrderItem;
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

    private static final int EXPIRATION_MINUTES = 15;

    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;

    @Override
    @Transactional
    public CheckoutResponse processCheckout(CheckoutRequest request, Long userAccountId) {
        reserveOrDeductInventory(request.getItems(), request.getPaymentMethod());

        BigDecimal subtotal = calculateSubtotal(request.getItems());
        BigDecimal shippingFee = request.getShippingFee() != null ? request.getShippingFee() : BigDecimal.ZERO;
        BigDecimal total = subtotal.add(shippingFee);

        boolean isCod = request.getPaymentMethod() == PaymentMethod.COD;
        OrderStatus initialStatus = isCod ? OrderStatus.READY_FOR_SHIPMENT : OrderStatus.PENDING_PAYMENT;
        LocalDateTime expiresAt = isCod ? null : LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES);

        Order order = buildOrder(request, userAccountId, subtotal, shippingFee, total, initialStatus, expiresAt);
        orderRepository.save(order);

        return buildCheckoutResponse(order.getId(), initialStatus, request.getPaymentMethod(), total, expiresAt, isCod);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByUserAccountId(Long userAccountId) {
        return orderRepository.findByUserAccountIdOrderByOrderDateDesc(userAccountId).stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(String orderId, Long userAccountId) {
        Order order = orderRepository.findByIdAndUserAccountId(orderId, userAccountId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Order not found with ID: " + orderId + " for userAccountId: " + userAccountId
                ));

        return mapToOrderResponse(order);
    }

    private void reserveOrDeductInventory(List<CheckoutRequest.CheckoutItemDto> items, PaymentMethod paymentMethod) {
        for (CheckoutRequest.CheckoutItemDto item : items) {
            int updatedRows = (paymentMethod == PaymentMethod.COD)
                    ? inventoryRepository.deductStockDirectly(item.getProductId(), item.getQuantity())
                    : inventoryRepository.reserveStock(item.getProductId(), item.getQuantity());

            if (updatedRows == 0) {
                throw new IllegalStateException(
                        "Stock checkout failed. Item '" + item.getProductName() + "' is out of stock or unavailable."
                );
            }
        }
    }

    private BigDecimal calculateSubtotal(List<CheckoutRequest.CheckoutItemDto> items) {
        return items.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private Order buildOrder(CheckoutRequest request, Long userAccountId, BigDecimal subtotal,
                             BigDecimal shippingFee, BigDecimal total, OrderStatus status, LocalDateTime expiresAt) {
        Order order = Order.builder()
                .id(UUID.randomUUID().toString())
                .userAccountId(userAccountId)
                .customerName(request.getCustomerName())
                .orderDate(LocalDateTime.now())
                .orderStatus(status)
                .paymentMethod(request.getPaymentMethod())
                .expiresAt(expiresAt)
                .shippingAddress(request.getShippingAddress())
                .subtotal(subtotal)
                .shippingFee(shippingFee)
                .total(total)
                .build();

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
        return order;
    }

    private CheckoutResponse buildCheckoutResponse(String orderId, OrderStatus status, PaymentMethod paymentMethod,
                                                   BigDecimal total, LocalDateTime expiresAt, boolean isCod) {
        String message = isCod
                ? "Order placed successfully."
                : "Order created. Please complete payment within " + EXPIRATION_MINUTES + " minutes.";

        return CheckoutResponse.builder()
                .orderId(orderId)
                .orderStatus(status)
                .paymentMethod(paymentMethod)
                .totalAmount(total)
                .expiresAt(expiresAt)
                .message(message)
                .build();
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderResponse.OrderItemDto> items = order.getOrderItems() != null
                ? order.getOrderItems().stream()
                .map(item -> OrderResponse.OrderItemDto.builder()
                        .id(item.getId())
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .imageUrl(item.getImageUrl())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .build())
                .toList()
                : List.of();

        return OrderResponse.builder()
                .id(order.getId())
                .userAccountId(order.getUserAccountId())
                .customerName(order.getCustomerName())
                .orderDate(order.getOrderDate())
                .orderStatus(order.getOrderStatus())
                .paymentMethod(order.getPaymentMethod())
                .expiresAt(order.getExpiresAt())
                .shippingAddress(order.getShippingAddress())
                .subtotal(order.getSubtotal())
                .shippingFee(order.getShippingFee())
                .total(order.getTotal())
                .items(items)
                .build();
    }
}