package com.violetCart.backend.domain.user.repository;

import com.violetCart.backend.domain.user.dto.response.SellerResponse;
import com.violetCart.backend.domain.user.entity.Role;
import com.violetCart.backend.domain.user.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {

    Optional<UserAccount> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("""
    SELECT new com.violetCart.backend.domain.user.dto.response.SellerResponse(
        u.firstName,
        u.lastName,
        u.contactNumber,
        s.storeName,
        s.storeDescription,
        COUNT(p),
        u.status,
        u.createdAt,
        u.email
    )
    FROM UserAccount u
    LEFT JOIN u.storeProfile s
    LEFT JOIN com.violetCart.backend.domain.product.entity.Product p ON p.storeProfile = s
    WHERE u.role = com.violetCart.backend.domain.user.entity.Role.ROLE_SELLER
    GROUP BY u.id, u.firstName, u.lastName, u.contactNumber, 
             s.storeName, s.storeDescription, u.status, u.createdAt, u.email
""")
    List<SellerResponse> findAllSellerResponses();
}