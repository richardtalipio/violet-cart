package com.violetCart.backend.domain.inventory.service;

import com.violetCart.backend.domain.inventory.entity.Inventory;
import com.violetCart.backend.domain.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;

    @Override
    public Inventory initializeStock(Long productId, Integer initialStock) {
        int stock = (initialStock != null) ? initialStock : 0;

        // Direct native insert bypasses JPA's isNew check for assigned IDs
        inventoryRepository.insertInitialInventory(productId, stock);

        return Inventory.builder()
                .productId(productId)
                .availableStock(stock)
                .reservedStock(0)
                .version(0L)
                .build();
    }

    @Override
    public void restockProduct(Long productId, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Restock quantity must be greater than 0");
        }
        int rowsUpdated = inventoryRepository.restockItem(productId, quantity);
        if (rowsUpdated == 0) {
            throw new IllegalArgumentException("Failed to restock. Inventory record not found for product ID: " + productId);
        }
    }
}