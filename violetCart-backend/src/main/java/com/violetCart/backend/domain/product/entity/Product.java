package com.violetCart.backend.domain.product.entity;

import com.violetCart.backend.domain.product.dto.AddProductResponse;
import com.violetCart.backend.domain.product.enums.ProductStatus;
import com.violetCart.backend.domain.user.entity.StoreProfile;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_name",  nullable = false)
    private String productName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    @Builder.Default
    private Integer stockQuantity = 0;

    @Column(name = "image_url")
    private String imageUrl;

    // Mapped to StoreProfile instead of UserAccount directly
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_profile_id", nullable = false)
    private StoreProfile storeProfile;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ProductStatus status = ProductStatus.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public AddProductResponse toProductResponse() {
        return AddProductResponse.builder()
                .productName(this.productName)
                .build();
    }
}