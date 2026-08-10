package com.violetCart.backend.domain.user.service;


import com.violetCart.backend.common.exception.ResourceNotFoundException;
import com.violetCart.backend.domain.user.dto.response.SellerResponse;
import com.violetCart.backend.domain.user.dto.response.UserResponse;
import com.violetCart.backend.domain.user.entity.UserAccount;
import com.violetCart.backend.domain.user.entity.UserStatus;
import com.violetCart.backend.domain.user.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserAccountServiceImpl implements UserAccountService {

    private final UserAccountRepository userAccountRepository;

    @Override
    public UserResponse getCurrentUserProfile(UserAccount userAccount) {
        log.info("Getting current user profile details ");
        return userAccount.toUserResponse();
    }

    @Override
    public List<SellerResponse> getAllSellers() {
        log.info("Getting all seller account details ");

        List<SellerResponse> sellerResponses = userAccountRepository.findAllSellerResponses();
        return sellerResponses;

    }

    @Transactional
    public UserResponse updateStatusByEmail(String email, UserStatus newStatus) {
        UserAccount user = userAccountRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        user.setStatus(newStatus);
        return user.toUserResponse();
    }

}
