package com.violetCart.backend.domain.user.service;

import com.violetCart.backend.common.exception.BadRequestException;
import com.violetCart.backend.domain.user.dto.response.SellerResponse;
import com.violetCart.backend.domain.user.dto.response.UserResponse;
import com.violetCart.backend.domain.user.entity.Role;
import com.violetCart.backend.domain.user.entity.StoreProfile;
import com.violetCart.backend.domain.user.entity.UserAccount;
import com.violetCart.backend.domain.user.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserAccountServiceImpl implements UserAccountService {

    private final UserAccountRepository userAccountRepository;

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
                .createdAt(userAccount.getCreatedAt())
                .updatedAt(userAccount.getUpdatedAt())
                .build();
    }

    @Override
    public List<SellerResponse> getAllSellers() {
        log.info("Getting all seller account details ");

        List<SellerResponse> sellerResponses = userAccountRepository.findAllSellerResponses();
        return sellerResponses;

    }


}
