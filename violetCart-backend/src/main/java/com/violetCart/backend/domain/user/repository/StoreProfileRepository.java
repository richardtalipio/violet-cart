package com.violetCart.backend.domain.user.repository;

import com.violetCart.backend.domain.user.entity.StoreProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreProfileRepository extends JpaRepository<StoreProfile, Long> {
}
