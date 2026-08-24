package com.violetCart.backend.domain.product.service;

import com.violetCart.backend.domain.product.dto.ProductRequest;
import com.violetCart.backend.domain.product.dto.ProductSearchCriteria;
import com.violetCart.backend.domain.product.dto.RetrieveProductResponse;
import com.violetCart.backend.domain.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface ProductService {
    /**
     * Adds a new product for the given store profile.
     * @param request the product details (includes image file)
     * @param storeProfileId the store profile ID (from authenticated user's CustomUserDetails)
     * @param userAccountId the user account ID (from authenticated user's CustomUserDetails)
     * @return the saved product
     */
    Product addProduct(ProductRequest request, Long storeProfileId, Long userAccountId);

    Page<RetrieveProductResponse> retrieveProducts(ProductSearchCriteria criteria, Pageable pageable, Long storeProfileId);

    List<String> retrieveAllCategories(Long storeProfileId);

    Product editProduct(ProductRequest request, Long storeProfileId, Long userAccountId);


}

