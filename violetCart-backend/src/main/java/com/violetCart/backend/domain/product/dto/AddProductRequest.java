package com.violetCart.backend.domain.product.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddProductRequest {

    @NotNull(message = "Image file is required")
    private MultipartFile imageFile;

    @NotBlank(message = "Product name cannot be blank")
    @Size(max = 25, message = "Product name must not exceed 25 characters")
    private String productName;

    @NotNull(message = "Price cannot be null")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @Min(value = 0, message = "Stock quantity must be a valid integer")
    private int stocksLeft;

    @NotBlank(message = "Category cannot be blank")
    @Size(max = 25, message = "Category must not exceed 25 characters")
    private String category;

    @NotBlank(message = "Description cannot be blank")
    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;

}
