package com.violetCart.backend.domain.product.service;

import com.violetCart.backend.domain.image.service.ImageStorageService;
import com.violetCart.backend.domain.inventory.entity.Inventory;
import com.violetCart.backend.domain.inventory.repository.InventoryRepository;
import com.violetCart.backend.domain.inventory.service.InventoryService;
import com.violetCart.backend.domain.product.dto.ProductRequest;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final StoreProfileRepository storeProfileRepository;
    private final ImageStorageService imageStorageService;
    private final InventoryService inventoryService;
    private final InventoryRepository inventoryRepository;

    @Override
    public Product addProduct(ProductRequest request, Long storeProfileId, Long userAccountId) {

        StoreProfile storeProfile = storeProfileRepository.findById(storeProfileId)
                .orElseThrow(() -> new IllegalArgumentException("Store profile not found with id: " + storeProfileId));


        Product product = Product.builder()
                .productName(request.getProductName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .storeProfile(storeProfile)
                .imageUrl("") // Placeholder until image is saved
                .build();

        product = productRepository.save(product);

        inventoryService.initializeStock(product.getId(), request.getStocksLeft());

        try {
            String imageFilename = imageStorageService.saveImage(
                    request.getImageFile(),
                    product.getId(),
                    userAccountId,
                    storeProfileId
            );

            product.setImageUrl(imageFilename);
            product = productRepository.save(product);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save product image: " + e.getMessage(), e);
        }

        return product;
    }

    @Override
    @Transactional(readOnly = true)
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

        // 1. Fetch paged product metadata
        Page<Product> productPage = productRepository.findAll(spec, pageable);

        if (productPage.isEmpty()) {
            return Page.empty(pageable);
        }

        // 2. Extract product IDs for the current page
        List<Long> productIds = productPage.getContent().stream()
                .map(Product::getId)
                .toList();

        // 3. Batch-fetch stock records from Inventory in a single IN query
        Map<Long, Inventory> inventoryMap = inventoryRepository.findAllById(productIds).stream()
                .collect(Collectors.toMap(Inventory::getProductId, Function.identity()));

        // 4. Map products to DTOs using actual available stock from inventory
        return productPage.map(product -> {
            Inventory inventory = inventoryMap.get(product.getId());
            int actualStock = (inventory != null && inventory.getAvailableStock() != null)
                    ? inventory.getAvailableStock()
                    : 0;

            return product.toRetrieveProductResponse(actualStock);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> retrieveAllCategories(Long storeProfileId) {
        if (storeProfileId == null) {
            return productRepository.findDistinctCategories();
        } else {
            return productRepository.findDistinctCategoriesByStoreProfileId(storeProfileId);
        }
    }

    @Override
    @Transactional
    public Product editProduct(ProductRequest request, Long storeProfileId, Long userAccountId) {
        Product product = productRepository.findByIdAndStoreProfileId(request.getId(), storeProfileId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + request.getId()));

        product.setProductName(request.getProductName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());

        MultipartFile imageFile = request.getImageFile();
        if (imageFile != null && !imageFile.isEmpty() && !"existing_image.jpg".equals(imageFile.getOriginalFilename())) {
            try {
                String newImageFilename = imageStorageService.saveImage(
                        imageFile,
                        product.getId(),
                        userAccountId,
                        storeProfileId
                );
                product.setImageUrl(newImageFilename);
            } catch (Exception e) {
                throw new RuntimeException("Failed to save product image: " + e.getMessage(), e);
            }
        }

        // 4. Update absolute inventory stock directly instead of calling restock (additive delta)
        Inventory inventory = inventoryRepository.findByProductId(product.getId())
                .orElseThrow(() -> new IllegalArgumentException("Inventory record not found for product id: " + product.getId()));

        inventory.setAvailableStock(request.getStocksLeft());

        // Managed entities automatically flush updates at transaction commit via Hibernate dirty checking
        return product;
    }
}