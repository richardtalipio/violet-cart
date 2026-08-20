package com.violetCart.backend.domain.order.repository;
import com.violetCart.backend.domain.order.dto.OrderStatus;
import com.violetCart.backend.domain.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {


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
}