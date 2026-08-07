package com.violetCart.backend.domain.user.dto.response;

import com.violetCart.backend.domain.user.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SellerResponse {
    private String fullName;
    private String contactNumber;
    private String storeName;
    private int productCount;
    private double revenue;
    private int noOfreports;
    private UserStatus userStatus;
    private LocalDateTime dateJoined;
    private String email;
    private String storeDescription;

    // Custom constructor required for JPQL Projection
    public SellerResponse(String firstName, String lastName, String contactNumber,
                          String storeName, String storeDescription, Long productCount,
                          UserStatus userStatus, LocalDateTime dateJoined, String email) {
        this.fullName = firstName + " " + lastName;
        this.contactNumber = contactNumber;
        this.storeName = storeName;
        this.storeDescription = storeDescription;
        this.productCount = productCount != null ? productCount.intValue() : 0;
        this.revenue = 0.0;     // Placeholder until Order module is implemented
        this.noOfreports = 0;   // Placeholder until Report module is implemented
        this.userStatus = userStatus;
        this.dateJoined = dateJoined;
        this.email = email;
    }
}