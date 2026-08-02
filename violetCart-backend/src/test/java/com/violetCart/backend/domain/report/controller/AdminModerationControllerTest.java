package com.violetCart.backend.domain.report.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.violetCart.backend.common.security.jwt.JwtUtils;
import com.violetCart.backend.domain.report.dto.ReportResponse;
import com.violetCart.backend.domain.report.dto.ResolveReportRequest;
import com.violetCart.backend.domain.report.enums.ReportStatus;
import com.violetCart.backend.domain.report.service.ReportService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminModerationController.class)
class AdminModerationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ReportService reportService;

    // Provide mock beans for security components expected by custom filters
    @MockitoBean
    private JwtUtils jwtUtils;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/v1/admin/moderation/users/{userId}/ban - Should trigger ban service")
    void banUser_Success() throws Exception {
        ResolveReportRequest request = ResolveReportRequest.builder()
                .adminNotes("Account banned due to multiple fraud reports.")
                .build();

        ReportResponse responseDto = ReportResponse.builder()
                .id(1L)
                .reportedUserId(2L)
                .status(ReportStatus.RESOLVED_BANNED)
                .adminNotes("Account banned due to multiple fraud reports.")
                .build();

        when(reportService.banUserAndResolveReports(eq(2L), any(ResolveReportRequest.class)))
                .thenReturn(responseDto);

        mockMvc.perform(post("/api/v1/admin/moderation/users/2/ban")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reportedUserId").value(2))
                .andExpect(jsonPath("$.status").value("RESOLVED_BANNED"))
                .andExpect(jsonPath("$.adminNotes").value("Account banned due to multiple fraud reports."));
    }
}