package com.violetCart.backend.domain.inventory.service;

import com.violetCart.backend.domain.inventory.entity.Inventory;

public interface InventoryService {
    Inventory initializeStock(Long productId, Integer initialStock);
    void restockProduct(Long productId, Integer quantity);
}
