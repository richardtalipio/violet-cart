package com.violetCart.backend.domain.report.service;

import com.violetCart.backend.common.exception.ResourceNotFoundException;
import com.violetCart.backend.domain.report.dto.ReportResponse;
import com.violetCart.backend.domain.report.dto.ResolveReportRequest;
import com.violetCart.backend.domain.report.entity.Report;
import com.violetCart.backend.domain.report.enums.ReportReason;
import com.violetCart.backend.domain.report.enums.ReportStatus;
import com.violetCart.backend.domain.report.enums.ReportType;
import com.violetCart.backend.domain.report.repository.ReportRepository;
import com.violetCart.backend.domain.user.entity.UserAccount;
import com.violetCart.backend.domain.user.entity.UserStatus;
import com.violetCart.backend.domain.user.repository.UserAccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReportServiceImplTest {

    @Mock
    private ReportRepository reportRepository;

    @Mock
    private UserAccountRepository userRepository;

    @InjectMocks
    private ReportServiceImpl reportService;

    private UserAccount reporterUser;
    private UserAccount targetUser;
    private Report openReport1;
    private Report openReport2;
    private ResolveReportRequest resolveRequest;

    @BeforeEach
    void setUp() {
        reporterUser = UserAccount.builder()
                .id(1L)
                .email("reporter@example.com")
                .build();

        targetUser = UserAccount.builder()
                .id(2L)
                .email("violator@example.com")
                .status(UserStatus.ACTIVE)
                .build();

        openReport1 = Report.builder()
                .id(101L)
                .reporter(reporterUser)
                .reportType(ReportType.USER)
                .reportedUser(targetUser)
                .status(ReportStatus.PENDING)
                .reason(ReportReason.FRAUDULENT_ACTIVITY)
                .description("Fraudulent activity")
                .build();

        openReport2 = Report.builder()
                .id(102L)
                .reporter(reporterUser)
                .reportType(ReportType.USER)
                .reportedUser(targetUser)
                .status(ReportStatus.PENDING)
                .reason(ReportReason.SPAM_OR_SCAM)
                .description("Spamming")
                .build();

        resolveRequest = ResolveReportRequest.builder()
                .adminNotes("Account banned due to multiple verified reports.")
                .build();
    }

    @Nested
    @DisplayName("Admin Resolution Tests")
    class AdminResolutionTests {

        @Test
        @DisplayName("Should ban user and resolve all open reports for that user")
        void shouldBanUserAndResolveAllOpenReportsForThatUser() {
            // Given
            Long userId = 2L;
            List<Report> openReports = List.of(openReport1, openReport2);

            when(userRepository.findById(userId)).thenReturn(Optional.of(targetUser));
            when(reportRepository.findByReportedUserIdAndStatus(eq(userId), eq(ReportStatus.PENDING)))
                    .thenReturn(openReports);
            when(reportRepository.saveAll(any())).thenReturn(openReports);

            // When
            ReportResponse response = reportService.banUserAndResolveReports(userId, resolveRequest);

            // Then
            assertThat(targetUser.getStatus()).isEqualTo(UserStatus.BANNED);
            assertThat(openReport1.getStatus()).isEqualTo(ReportStatus.RESOLVED_BANNED);
            assertThat(openReport1.getAdminNotes()).isEqualTo("Account banned due to multiple verified reports.");
            assertThat(openReport2.getStatus()).isEqualTo(ReportStatus.RESOLVED_BANNED);

            verify(userRepository).save(targetUser);
            verify(reportRepository).saveAll(openReports);

            assertThat(response).isNotNull();
        }

        @Test
        @DisplayName("Should throw Exception when user to ban is not found")
        void shouldThrowExceptionWhenUserNotFound() {
            // Given
            Long userId = 99L;
            when(userRepository.findById(userId)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> reportService.banUserAndResolveReports(userId, resolveRequest))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }
}