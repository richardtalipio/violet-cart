package com.violetCart.backend.domain.user.dto.response;

import com.violetCart.backend.domain.user.entity.Role;
import com.violetCart.backend.domain.user.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private UserStatus userStatus;
}
