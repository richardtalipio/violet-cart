package com.violetCart.backend.domain.user.controller;

import com.violetCart.backend.common.response.ApiResponse;
import com.violetCart.backend.domain.product.service.ProductService;
import com.violetCart.backend.domain.user.dto.response.StoreProfileResponse;
import com.violetCart.backend.domain.user.dto.response.UserResponse;
import com.violetCart.backend.domain.user.entity.CustomUserDetails;
import com.violetCart.backend.domain.user.entity.StoreProfile;
import com.violetCart.backend.domain.user.service.StoreProfileService;
import com.violetCart.backend.domain.user.service.UserAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserAccountService userAccountService;
    private final StoreProfileService storeProfileService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        UserResponse response = userAccountService.getCurrentUserProfile(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved successfully", response));
    }

    @GetMapping("/myStore")
    public ResponseEntity<ApiResponse<StoreProfileResponse>> getStoreProfile(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        Long id = currentUser.getStoreProfileId();
        if (id == null) {
            return ResponseEntity.status(404).body(ApiResponse.error("Store profile not found for this user"));
        }
        StoreProfile storeProfile = storeProfileService.findById(id);
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved successfully", storeProfile.toStoreProfileResponse()));
    }


}
