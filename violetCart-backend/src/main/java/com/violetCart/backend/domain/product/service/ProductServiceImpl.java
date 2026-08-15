package com.violetCart.backend.domain.product.service;

import com.violetCart.backend.common.utils.ImageStorageService;
import com.violetCart.backend.domain.product.dto.AddProductRequest;
import com.violetCart.backend.domain.product.entity.Product;
import com.violetCart.backend.domain.product.repository.ProductRepository;
import com.violetCart.backend.domain.user.entity.StoreProfile;
import com.violetCart.backend.domain.user.repository.StoreProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}
