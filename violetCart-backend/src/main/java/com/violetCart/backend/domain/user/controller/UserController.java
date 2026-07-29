package com.violetCart.backend.domain.user.controller;

import com.violetCart.backend.common.response.ApiResponse;
import com.violetCart.backend.domain.user.dto.response.UserResponse;
import com.violetCart.backend.domain.user.entity.UserAccount;
import com.violetCart.backend.domain.user.service.UserService;
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
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal UserAccount currentUser
    ) {
        UserResponse response = userService.getCurrentUserProfile(currentUser);
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved successfully", response));
    }
}
