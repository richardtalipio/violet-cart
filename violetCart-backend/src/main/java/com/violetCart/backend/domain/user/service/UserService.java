package com.violetCart.backend.domain.user.service;

import com.violetCart.backend.domain.user.dto.response.UserResponse;
import com.violetCart.backend.domain.user.entity.UserAccount;

public interface UserService {
    UserResponse getCurrentUserProfile(UserAccount userAccount);
}

