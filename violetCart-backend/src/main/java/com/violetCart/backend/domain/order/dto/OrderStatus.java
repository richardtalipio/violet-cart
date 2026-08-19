package com.violetCart.backend.domain.order.dto;

public enum OrderStatus {

    PENDING_PAYMENT("Pending Payment"),
    PAID("Paid"),
    TO_SHIP("To Ship"),
    TO_RECEIVE("To Receive"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled");

    private final String value;

    OrderStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
