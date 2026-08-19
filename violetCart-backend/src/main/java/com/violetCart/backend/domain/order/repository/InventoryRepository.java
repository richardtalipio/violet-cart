package com.violetCart.backend.domain.order.repository;
import com.violetCart.backend.domain.order.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    /**
     * ATOMIC RESERVATION (For Online Payments)
     * Decrements available stock and increments reserved stock in a single atomic SQL statement.
     * Returns 1 if successful, 0 if available_stock was insufficient.
     */
    @Modifying
    @Query(value = """
        UPDATE inventory 
        SET available_stock = available_stock - :quantity,
            reserved_stock = reserved_stock + :quantity,
            version = version + 1
        WHERE product_id = :productId 
          AND available_stock >= :quantity
        """, nativeQuery = true)
    int reserveStock(@Param("productId") Long productId, @Param("quantity") Integer quantity);

    /**
     * ATOMIC HARD DEDUCTION (For COD Orders)
     * Directly subtracts stock from available stock upon checkout placement.
     * Returns 1 if successful, 0 if available_stock was insufficient.
     */
    @Modifying
    @Query(value = """
        UPDATE inventory 
        SET available_stock = available_stock - :quantity,
            version = version + 1
        WHERE product_id = :productId 
          AND available_stock >= :quantity
        """, nativeQuery = true)
    int deductStockDirectly(@Param("productId") Long productId, @Param("quantity") Integer quantity);

    /**
     * RELEASE RESERVED STOCK (For Expired / Cancelled Online Payment Orders)
     * Moves reserved stock back to available stock.
     */
    @Modifying
    @Query(value = """
        UPDATE inventory 
        SET available_stock = available_stock + :quantity,
            reserved_stock = reserved_stock - :quantity,
            version = version + 1
        WHERE product_id = :productId 
          AND reserved_stock >= :quantity
        """, nativeQuery = true)
    int releaseReservedStock(@Param("productId") Long productId, @Param("quantity") Integer quantity);

    /**
     * COMMIT RESERVED STOCK (When Payment Succeeds for Online Payment)
     * Permanently clears reserved stock after successful payment gateway callback.
     */
    @Modifying
    @Query(value = """
        UPDATE inventory 
        SET reserved_stock = reserved_stock - :quantity,
            version = version + 1
        WHERE product_id = :productId 
          AND reserved_stock >= :quantity
        """, nativeQuery = true)
    int confirmReservedStockDeduction(@Param("productId") Long productId, @Param("quantity") Integer quantity);

    /**
     * RESTOCK RETURNED ITEMS (For Failed COD Deliveries / Returns)
     */
    @Modifying
    @Query(value = """
        UPDATE inventory 
        SET available_stock = available_stock + :quantity,
            version = version + 1
        WHERE product_id = :productId
        """, nativeQuery = true)
    int restockItem(@Param("productId") Long productId, @Param("quantity") Integer quantity);
}
