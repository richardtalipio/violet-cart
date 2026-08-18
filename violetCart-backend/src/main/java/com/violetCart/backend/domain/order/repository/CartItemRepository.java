package com.violetCart.backend.domain.order.repository;

import com.violetCart.backend.domain.order.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserAccountId(Long userAccountId);

    Optional<CartItem> findByUserAccountIdAndProductId(Long userAccountId, Long productId);

    void deleteByUserAccountId(Long userAccountId);
}
