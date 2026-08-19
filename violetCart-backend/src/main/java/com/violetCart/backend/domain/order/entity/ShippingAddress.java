package com.violetCart.backend.domain.order.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShippingAddress {

    @Column(name = "shipping_full_name", nullable = false)
    private String fullName;

    @Column(name = "shipping_phone", nullable = false, length = 50)
    private String phone;

    @Column(name = "shipping_street", nullable = false)
    private String street;

    @Column(name = "shipping_city", nullable = false)
    private String city;

    @Column(name = "shipping_province", nullable = false)
    private String province;

    @Column(name = "shipping_postal_code", nullable = false, length = 50)
    private String postalCode;
}
