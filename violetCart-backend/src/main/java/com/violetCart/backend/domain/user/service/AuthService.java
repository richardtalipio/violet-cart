package com.violetCart.backend.domain.user.service;

import com.violetCart.backend.domain.user.dto.request.LoginRequest;
import com.violetCart.backend.domain.user.dto.request.RegisterRequest;
import com.violetCart.backend.domain.user.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest registerRequest);
    AuthResponse login(LoginRequest loginRequest);
}
