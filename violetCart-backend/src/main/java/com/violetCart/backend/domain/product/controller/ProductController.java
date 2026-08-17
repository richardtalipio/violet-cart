package com.violetCart.backend.domain.product.controller;

import com.violetCart.backend.common.response.ApiResponse;
import com.violetCart.backend.domain.product.dto.AddProductRequest;
import com.violetCart.backend.domain.product.dto.ProductSearchCriteria;
import com.violetCart.backend.domain.product.dto.RetrieveProductResponse;
import com.violetCart.backend.domain.product.entity.Product;
import com.violetCart.backend.domain.product.service.ProductService;
import com.violetCart.backend.domain.user.entity.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * Adds a new product for the authenticated seller's store.
     * Accepts multipart/form-data with image file.
     * Only sellers with an active store profile can add products.
     */
    @PreAuthorize("hasRole('SELLER')")
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<RetrieveProductResponse>> addProduct(
            @RequestParam("imageFile") MultipartFile imageFile,
            @RequestParam("productName") String productName,
            @RequestParam("price") java.math.BigDecimal price,
            @RequestParam("stocksLeft") int stocksLeft,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        // Ensure the user has a store profile (is a seller)
        if (currentUser.getStoreProfileId() == null) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("User does not have an active store profile"));
        }

        // Build request object
        AddProductRequest request = AddProductRequest.builder()
                .imageFile(imageFile)
                .productName(productName)
                .price(price)
                .stocksLeft(stocksLeft)
                .category(category)
                .description(description)
                .build();

        // Save the product (service handles image storage)
        Product savedProduct = productService.addProduct(request, currentUser.getStoreProfileId(), currentUser.getId());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product added successfully", savedProduct.toRetrieveProductResponse()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<RetrieveProductResponse>>> getProducts(
            @ModelAttribute ProductSearchCriteria criteria,
            @PageableDefault(size = 10, sort = "productName", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Long storeProfileId = null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            storeProfileId = ((CustomUserDetails) authentication.getPrincipal()).getStoreProfileId();
        }
        Page<RetrieveProductResponse> products = productService.retrieveProducts(criteria, pageable, storeProfileId);
        return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", products));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        Long storeProfileId = null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            storeProfileId = ((CustomUserDetails) authentication.getPrincipal()).getStoreProfileId();
        }
        List<String> categories = productService.retrieveAllCategories(storeProfileId);
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", categories));
    }
}
