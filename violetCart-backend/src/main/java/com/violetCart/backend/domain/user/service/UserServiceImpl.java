package com.violetCart.backend.domain.user.service;

import com.violetCart.backend.domain.user.dto.response.UserResponse;
import com.violetCart.backend.domain.user.entity.UserAccount;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Override
    public UserResponse getCurrentUserProfile(UserAccount userAccount) {
        log.info("Getting current user profile details ");
        return UserResponse.builder()
                .id(userAccount.getId())
                .firstName(userAccount.getFirstName())
                .lastName(userAccount.getLastName())
                .email(userAccount.getEmail())
                .role(userAccount.getRole())
                .status(userAccount.getStatus())
                .storeDescription(userAccount.getStoreDescription())
                .createdAt(userAccount.getCreatedAt())
                .updatedAt(userAccount.getUpdatedAt())
                .build();
    }
}
