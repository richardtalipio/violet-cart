package com.violetCart.backend.domain.user.service;

import com.violetCart.backend.common.exception.BadRequestException;
import com.violetCart.backend.common.security.jwt.JwtUtils;
import com.violetCart.backend.domain.user.dto.request.LoginRequest;
import com.violetCart.backend.domain.user.dto.request.RegisterRequest;
import com.violetCart.backend.domain.user.dto.response.AuthResponse;
import com.violetCart.backend.domain.user.entity.Role;
import com.violetCart.backend.domain.user.entity.StoreProfile;
import com.violetCart.backend.domain.user.entity.UserAccount;
import com.violetCart.backend.domain.user.entity.UserStatus;
import com.violetCart.backend.domain.user.repository.StoreProfileRepository;
import com.violetCart.backend.domain.user.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final StoreProfileRepository storeProfileRepository;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        log.info("Processing registration request for email: {}", registerRequest.getEmail());

        validateRegistration(registerRequest);

        UserAccount savedUser = createUserAccount(registerRequest);

        if (registerRequest.getRole() == Role.ROLE_SELLER) {
            createStoreProfile(savedUser, registerRequest);
        }

        String token = jwtUtils.generateToken(savedUser);
        return mapToAuthResponse(savedUser, token);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest loginRequest) {
        log.info("Processing login request for email: {}", loginRequest.getEmail());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        UserAccount user = userAccountRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        String token = jwtUtils.generateToken(user);
        return mapToAuthResponse(user, token);
    }

    // --- Helper Methods (Encapsulation & SRP) ---

    private void validateRegistration(RegisterRequest request) {
        if (userAccountRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already in use");
        }

        if (request.getRole() == Role.ROLE_SELLER) {
            if (request.getStoreName() == null || request.getStoreName().isBlank()) {
                throw new BadRequestException("Store name is required for seller accounts");
            }
            if (request.getStoreDescription() == null || request.getStoreDescription().isBlank()) {
                throw new BadRequestException("Store description is required for seller accounts");
            }
        }
    }

    private UserAccount createUserAccount(RegisterRequest request) {
        UserStatus initialStatus = (request.getRole() == Role.ROLE_SELLER)
                ? UserStatus.PENDING_APPROVAL
                : UserStatus.ACTIVE;

        UserAccount user = UserAccount.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .contactNumber(request.getContactNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .status(initialStatus)
                .build();

        return userAccountRepository.save(user);
    }

    private void createStoreProfile(UserAccount user, RegisterRequest request) {
        StoreProfile storeProfile = StoreProfile.builder()
                .userAccount(user)
                .storeName(request.getStoreName())
                .storeDescription(request.getStoreDescription())
                .build();

        storeProfileRepository.save(storeProfile);
    }

    private AuthResponse mapToAuthResponse(UserAccount user, String token) {
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .userStatus(user.getStatus())
                .build();
    }
}