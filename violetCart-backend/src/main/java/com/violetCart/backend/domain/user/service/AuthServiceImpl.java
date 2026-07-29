package com.violetCart.backend.domain.user.service;

import com.violetCart.backend.common.exception.BadRequestException;
import com.violetCart.backend.common.security.jwt.JwtUtils;
import com.violetCart.backend.domain.user.dto.request.LoginRequest;
import com.violetCart.backend.domain.user.dto.request.RegisterRequest;
import com.violetCart.backend.domain.user.dto.response.AuthResponse;
import com.violetCart.backend.domain.user.entity.Role;
import com.violetCart.backend.domain.user.entity.UserAccount;
import com.violetCart.backend.domain.user.entity.UserStatus;
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
public class AuthServiceImpl  implements AuthService{

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;


    @Override
    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        log.info("Register request : {}", registerRequest.toString());
        if(userAccountRepository.existsByEmail(registerRequest.getEmail())){
            throw new BadRequestException("Email address is already in use");
        }

        if(registerRequest.getRole() == Role.ROLE_SELLER){
            if(registerRequest.getStoreDescription() == null ||
                    registerRequest.getStoreDescription().trim().isEmpty()){
                throw new BadRequestException("Store description is required for seller accounts");
            }
        }

        UserStatus initialStatus = (registerRequest.getRole() == Role.ROLE_SELLER)
                ? UserStatus.PENDING_APPROVAL
                : UserStatus.ACTIVE;

        UserAccount user = UserAccount.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(registerRequest.getRole())
                .status(initialStatus)
                .storeDescription(registerRequest.getStoreDescription())
                .build();

        UserAccount savedUser = userAccountRepository.save(user);
        String token = jwtUtils.generateToken(savedUser);

        return AuthResponse.builder()
                .token(token)
                .id(savedUser.getId())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .userStatus(savedUser.getStatus())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        log.info("Login request : {}", loginRequest.toString());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        UserAccount user = userAccountRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadRequestException("User account not found"));

        String token = jwtUtils.generateToken(user);

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
