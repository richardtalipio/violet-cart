package com.violetCart.backend.domain.order.repository;

import com.violetCart.backend.domain.order.dto.OrderStatus;
import com.violetCart.backend.domain.order.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String>, JpaSpecificationExecutor<Order> {

    List<Order> findByUserAccountIdOrderByOrderDateDesc(Long userAccountId);

    Optional<Order> findByIdAndUserAccountId(String id, Long userAccountId);

    List<Order> findByOrderStatus(OrderStatus orderStatus);

    @Query("""
        SELECT o FROM Order o 
        WHERE o.orderStatus = :status 
          AND o.expiresAt IS NOT NULL 
          AND o.expiresAt < :now
        """)
    List<Order> findExpiredOrders(@Param("status") OrderStatus status, @Param("now") LocalDateTime now);

    // ✅ FIXED: Changed item.storeProfile.id to item.storeProfileId
    @Query("SELECT DISTINCT o FROM Order o JOIN o.orderItems item WHERE item.storeProfileId = :storeId")
    Page<Order> findOrdersByStoreId(@Param("storeId") Long storeId, Pageable pageable);
}