package com.violetCart.backend.domain.product.service;

import com.violetCart.backend.domain.image.service.ImageStorageService;
import com.violetCart.backend.domain.product.dto.AddProductRequest;
import com.violetCart.backend.domain.product.dto.ProductSearchCriteria;
import com.violetCart.backend.domain.product.dto.RetrieveProductResponse;
import com.violetCart.backend.domain.product.entity.Product;
import com.violetCart.backend.domain.product.repository.ProductRepository;
import com.violetCart.backend.domain.user.entity.StoreProfile;
import com.violetCart.backend.domain.user.repository.StoreProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final StoreProfileRepository storeProfileRepository;
    private final ImageStorageService imageStorageService;

    @Override
    public Product addProduct(AddProductRequest request, Long storeProfileId, Long userAccountId) {
        // Fetch the store profile (seller's store)
        StoreProfile storeProfile = storeProfileRepository.findById(storeProfileId)
                .orElseThrow(() -> new IllegalArgumentException("Store profile not found with id: " + storeProfileId));

        // Create product first without image URL to get the ID
        Product product = Product.builder()
                .productName(request.getProductName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .stockQuantity(request.getStocksLeft())
                .storeProfile(storeProfile)
                .imageUrl("") // Placeholder, will update after getting product ID
                .build();

        // Save product to get the ID
        product = productRepository.save(product);

        // Now save the image file with naming convention: ProductId_userAccountId_storeProfileId
        try {
            String imageFilename = imageStorageService.saveImage(
                    request.getImageFile(),
                    product.getId(),
                    userAccountId,
                    storeProfileId
            );

            // Update product with the saved image filename
            product.setImageUrl(imageFilename);
            product = productRepository.save(product);
        } catch (Exception e) {
            // If image save fails, delete the product to maintain data consistency
            productRepository.delete(product);
            throw new RuntimeException("Failed to save product image: " + e.getMessage(), e);
        }

        return product;
    }

    @Override
    public Page<RetrieveProductResponse> retrieveProducts(ProductSearchCriteria criteria, Pageable pageable, Long storeProfileId) {
        Specification<Product> spec = Specification.where(null);

        if (criteria.getProductName() != null && !criteria.getProductName().isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("productName")), "%" + criteria.getProductName().toLowerCase() + "%"));
        }
        if (criteria.getCategory() != null && !criteria.getCategory().isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category"), criteria.getCategory()));
        }
        if (storeProfileId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("storeProfile").get("id"), storeProfileId));
        }

        return productRepository.findAll(spec, pageable)
                .map(Product::toRetrieveProductResponse);
    }

    public List<String> retrieveAllCategories(Long storeProfileId) {
        if(storeProfileId == null){
            return productRepository.findDistinctCategories();
        }else {
            return productRepository.findDistinctCategoriesByStoreProfileId(storeProfileId);
        }
    }
}
