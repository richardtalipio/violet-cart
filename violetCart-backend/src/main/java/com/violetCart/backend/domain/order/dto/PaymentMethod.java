package com.violetCart.backend.domain.order.dto;

public enum PaymentMethod {
    ONLINE("ONLINE"),
    COD("COD");

    private final String value;

    PaymentMethod(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}