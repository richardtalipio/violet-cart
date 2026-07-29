package com.violetCart.backend.domain.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.violetCart.backend.domain.user.dto.request.LoginRequest;
import com.violetCart.backend.domain.user.dto.request.RegisterRequest;
import com.violetCart.backend.domain.user.entity.Role;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.contains;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/v1/auth/register - Success 201 Created")
    void register_Success() throws Exception {
        String uniqueEmail = "jane." + UUID.randomUUID() + "@example.com";

        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Jane");
        request.setLastName("Doe");
        request.setEmail(uniqueEmail);
        request.setPassword("Password123!");
        request.setRole(Role.ROLE_CUSTOMER);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.email", is(uniqueEmail)))
                .andExpect(jsonPath("$.data.role", is("ROLE_CUSTOMER")))
                .andExpect(jsonPath("$.data.userStatus", is("ACTIVE")))
                .andExpect(jsonPath("$.data.token").exists());
    }

    @Test
    @DisplayName("POST /api/v1/auth/register - Validation Failure 400 Bad Request")
    void register_InvalidEmail_Returns400() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Jane");
        request.setLastName("Doe");
        request.setEmail("invalid-email-format");
        request.setPassword("short");
        request.setRole(Role.ROLE_CUSTOMER);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", is("Validation failed")))
                .andExpect(jsonPath("$.data[?(@.field == 'email')].message", contains("Must be a valid email address")))
                .andExpect(jsonPath("$.data[?(@.field == 'password')].message", contains("Password must be at least 8 characters")));
    }

    @Test
    @DisplayName("POST /api/v1/auth/login - Success 200 OK")
    void login_Success() throws Exception {
        String uniqueEmail = "jane." + UUID.randomUUID() + "@example.com";

        // 1. Register account
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setFirstName("Jane");
        registerReq.setLastName("Doe");
        registerReq.setEmail(uniqueEmail);
        registerReq.setPassword("Password123!");
        registerReq.setRole(Role.ROLE_CUSTOMER);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated());

        // 2. Perform login
        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail(uniqueEmail);
        loginReq.setPassword("Password123!");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token").exists());
    }
}