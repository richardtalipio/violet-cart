package com.violetCart.backend.domain.product.repository;

import com.violetCart.backend.domain.product.entity.Product;
import com.violetCart.backend.domain.product.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL ORDER BY p.category ASC")
    List<String> findDistinctCategories();

    // If categories should only belong to the authenticated seller's store:
    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.storeProfile.id = :storeProfileId AND p.category IS NOT NULL ORDER BY p.category ASC")
    List<String> findDistinctCategoriesByStoreProfileId(@Param("storeProfileId") Long storeProfileId);

}