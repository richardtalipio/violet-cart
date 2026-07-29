package com.violetCart.backend.domain.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.violetCart.backend.domain.user.dto.request.RegisterRequest;
import com.violetCart.backend.domain.user.entity.Role;
import com.violetCart.backend.domain.user.repository.UserAccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @BeforeEach
    void setUp() {
        userAccountRepository.deleteAll();
    }

    @Test
    @DisplayName("GET /api/v1/users/me - 401 Unauthorized without Token")
    void getCurrentUser_NoToken_Returns401() throws Exception {
        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isForbidden()); // or isUnauthorized depending on SecurityConfig entrypoint
    }

    @Test
    @DisplayName("GET /api/v1/users/me - 200 OK with Valid Token")
    void getCurrentUser_WithToken_Success() throws Exception {

        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setFirstName("Alice");
        registerReq.setLastName("Wonderland");
        registerReq.setEmail("alice@example.com");
        registerReq.setPassword("Password123!");
        registerReq.setRole(Role.ROLE_CUSTOMER);

        MvcResult registerResult = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andReturn();

        String responseJson = registerResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseJson).path("data").path("token").asText();

        mockMvc.perform(get("/api/v1/users/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.email", is("alice@example.com")))
                .andExpect(jsonPath("$.data.firstName", is("Alice")));
    }
}