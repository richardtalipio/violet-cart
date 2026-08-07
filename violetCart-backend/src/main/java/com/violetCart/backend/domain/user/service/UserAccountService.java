package com.violetCart.backend.domain.user.service;

import com.violetCart.backend.domain.user.dto.response.SellerResponse;
import com.violetCart.backend.domain.user.dto.response.UserResponse;
import com.violetCart.backend.domain.user.entity.UserAccount;

import java.util.List;

public interface UserAccountService {
    UserResponse getCurrentUserProfile(UserAccount userAccount);
    List<SellerResponse> getAllSellers();
}

