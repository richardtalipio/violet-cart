package com.violetCart.backend.domain.user.service;

import com.violetCart.backend.domain.user.dto.response.SellerResponse;
import com.violetCart.backend.domain.user.dto.response.UserResponse;
import com.violetCart.backend.domain.user.entity.UserStatus;

import java.util.List;

public interface UserAccountService {
    UserResponse getCurrentUserProfile(Long userId);
    List<SellerResponse> getAllSellers();
    UserResponse updateStatusByEmail(String email, UserStatus status);
}

