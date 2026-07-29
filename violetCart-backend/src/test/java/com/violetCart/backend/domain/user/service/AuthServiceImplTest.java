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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceImplTest {

    @Mock
    private UserAccountRepository userAccountRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest customerRegisterRequest;
    private RegisterRequest sellerRegisterRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        customerRegisterRequest = new RegisterRequest();
        customerRegisterRequest.setFirstName("Jane");
        customerRegisterRequest.setLastName("Doe");
        customerRegisterRequest.setEmail("jane@example.com");
        customerRegisterRequest.setPassword("Password123!");
        customerRegisterRequest.setRole(Role.ROLE_CUSTOMER);

        sellerRegisterRequest = new RegisterRequest();
        sellerRegisterRequest.setFirstName("John");
        sellerRegisterRequest.setLastName("Smith");
        sellerRegisterRequest.setEmail("seller@example.com");
        sellerRegisterRequest.setPassword("Password123!");
        sellerRegisterRequest.setRole(Role.ROLE_SELLER);
        sellerRegisterRequest.setStoreDescription("Custom Keyboards Store");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("jane@example.com");
        loginRequest.setPassword("Password123!");
    }

    @Test
    @DisplayName("Should successfully register a customer with ACTIVE status")
    void registerCustomer_Success() {
        when(userAccountRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");

        UserAccount savedUser = UserAccount.builder()
                .id(1L)
                .firstName(customerRegisterRequest.getFirstName())
                .lastName(customerRegisterRequest.getLastName())
                .email(customerRegisterRequest.getEmail())
                .password("hashedPassword")
                .role(Role.ROLE_CUSTOMER)
                .status(UserStatus.ACTIVE)
                .build();

        when(userAccountRepository.save(any(UserAccount.class))).thenReturn(savedUser);
        when(jwtUtils.generateToken(any(UserAccount.class))).thenReturn("mockJwtToken");

        AuthResponse response = authService.register(customerRegisterRequest);

        assertNotNull(response);
        assertEquals("mockJwtToken", response.getToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals(UserStatus.ACTIVE, response.getUserStatus());
        assertEquals(Role.ROLE_CUSTOMER, response.getRole());

        verify(userAccountRepository, times(1)).save(any(UserAccount.class));
    }

    @Test
    @DisplayName("Should register seller with PENDING_APPROVAL status")
    void registerSeller_Success() {
        when(userAccountRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");

        UserAccount savedSeller = UserAccount.builder()
                .id(2L)
                .firstName(sellerRegisterRequest.getFirstName())
                .lastName(sellerRegisterRequest.getLastName())
                .email(sellerRegisterRequest.getEmail())
                .password("hashedPassword")
                .role(Role.ROLE_SELLER)
                .status(UserStatus.PENDING_APPROVAL)
                .storeDescription(sellerRegisterRequest.getStoreDescription())
                .build();

        when(userAccountRepository.save(any(UserAccount.class))).thenReturn(savedSeller);
        when(jwtUtils.generateToken(any(UserAccount.class))).thenReturn("mockJwtToken");

        AuthResponse response = authService.register(sellerRegisterRequest);

        assertNotNull(response);
        assertEquals(UserStatus.PENDING_APPROVAL, response.getUserStatus());
        assertEquals(Role.ROLE_SELLER, response.getRole());
    }

    @Test
    @DisplayName("Should throw BadRequestException if registering email already exists")
    void register_EmailAlreadyExists_ThrowsException() {
        when(userAccountRepository.existsByEmail(customerRegisterRequest.getEmail())).thenReturn(true);

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> authService.register(customerRegisterRequest));

        assertEquals("Email address is already in use", ex.getMessage());
        verify(userAccountRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw BadRequestException if seller registers without store description")
    void registerSeller_MissingDescription_ThrowsException() {
        sellerRegisterRequest.setStoreDescription(null);
        when(userAccountRepository.existsByEmail(anyString())).thenReturn(false);

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> authService.register(sellerRegisterRequest));

        assertEquals("Store description is required for seller accounts", ex.getMessage());
    }

    @Test
    @DisplayName("Should login successfully with correct credentials")
    void login_Success() {
        UserAccount user = UserAccount.builder()
                .id(1L)
                .email("jane@example.com")
                .password("hashedPassword")
                .role(Role.ROLE_CUSTOMER)
                .status(UserStatus.ACTIVE)
                .build();

        when(userAccountRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(user));
        when(jwtUtils.generateToken(user)).thenReturn("mockJwtToken");

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("mockJwtToken", response.getToken());
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    @DisplayName("Should throw BadCredentialsException when authentication fails")
    void login_InvalidCredentials_ThrowsException() {
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(loginRequest));
    }
}
