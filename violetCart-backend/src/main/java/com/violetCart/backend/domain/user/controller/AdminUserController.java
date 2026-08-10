package com.violetCart.backend.domain.user.controller;

import com.violetCart.backend.common.response.ApiResponse;
import com.violetCart.backend.domain.user.dto.request.UpdateStatusRequest;
import com.violetCart.backend.domain.user.dto.response.SellerResponse;
import com.violetCart.backend.domain.user.dto.response.UserResponse;
import com.violetCart.backend.domain.user.service.UserAccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserAccountService userAccountService;

    @GetMapping("/sellers")
    public ResponseEntity<ApiResponse<List<SellerResponse>>> getAllSellers() {
        return ResponseEntity.ok(ApiResponse.success("Seller list retrieved successfully", userAccountService.getAllSellers()));
    }

    @PatchMapping("/{email}/status")
    public ResponseEntity<ApiResponse<UserResponse>> updateSellerStatusByEmail(
            @PathVariable String email,
            @Valid @RequestBody UpdateStatusRequest request) {
        userAccountService.updateStatusByEmail(email, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("User status success updated"
                , userAccountService.updateStatusByEmail(email, request.getStatus())));
    }
}
