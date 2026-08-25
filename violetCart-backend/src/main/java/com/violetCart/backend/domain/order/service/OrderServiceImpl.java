package com.violetCart.backend.domain.order.service;

import com.violetCart.backend.domain.inventory.repository.InventoryRepository;
import com.violetCart.backend.domain.order.dto.*;
import com.violetCart.backend.domain.order.entity.Order;
import com.violetCart.backend.domain.order.entity.OrderItem;
import com.violetCart.backend.domain.order.repository.OrderRepository;
import com.violetCart.backend.domain.order.repository.OrderSpecification;
import com.violetCart.backend.domain.user.entity.CustomUserDetails;
import com.violetCart.backend.domain.user.entity.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
        OrderStatus initialStatus = isCod ? OrderStatus.PREPARING : OrderStatus.PENDING_PAYMENT;
        LocalDateTime expiresAt = isCod ? null : LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES);

        Order order = buildOrder(request, userAccountId, subtotal, shippingFee, total, initialStatus, expiresAt);
        orderRepository.save(order);

        return buildCheckoutResponse(order.getId(), initialStatus, request.getPaymentMethod(), total, expiresAt, isCod);
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

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getOrders(
            OrderSearchCriteria criteria,
            Pageable pageable,
            CustomUserDetails customUserDetails
    ) {
        Long sellerStoreProfileId = null;
        Long customerUserAccountId = null;

        // Determine context role from CustomUserDetails
        if (customUserDetails.getRole().equals(Role.ROLE_SELLER)) {
            sellerStoreProfileId = customUserDetails.getStoreProfileId();
        } else if  (customUserDetails.getRole().equals(Role.ROLE_CUSTOMER)){
            customerUserAccountId = customUserDetails.getId();
        }

        // Build specification combining security constraints & search filters
        Specification<Order> spec = OrderSpecification.build(
                criteria,
                sellerStoreProfileId,
                customerUserAccountId
        );

        // Fetch paginated entities and map to response DTOs
        Page<Order> orderPage = orderRepository.findAll(spec, pageable);

        return orderPage.map(this::mapToOrderResponse);
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
                        .storeProfileId(itemDto.getStoreProfileId())
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

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(String orderId, OrderStatus newStatus, CustomUserDetails customUserDetails) {
        if (!Role.ROLE_SELLER.equals(customUserDetails.getRole())) {
            throw new IllegalStateException("Only sellers are authorized to update order status.");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        Long sellerStoreProfileId = customUserDetails.getStoreProfileId();

        // Verify at least one item in the order belongs to this seller's store
        boolean belongsToSeller = order.getOrderItems().stream()
                .anyMatch(item -> sellerStoreProfileId != null && sellerStoreProfileId.equals(item.getStoreProfileId()));

        if (!belongsToSeller) {
            throw new IllegalStateException("Unauthorized: Order does not contain products from your store.");
        }

        order.setOrderStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);

        return mapToOrderResponse(updatedOrder);
    }
}