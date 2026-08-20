package com.violetCart.backend.domain.order.dto;

public enum OrderStatus {

    PENDING_PAYMENT("Pending Payment"),
    PREPARING("Preparing"),
    READY_FOR_SHIPMENT("Ready for Shipment"),
    IN_TRANSIT("In Transit"),
    OUT_FOR_DELIVERY("Out for Delivery"),
    DELIVERED("Delivered"),
    CANCELLED("Cancelled"),
    EXPIRED("Expired");

    private final String value;

    OrderStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
