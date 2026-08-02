package com.violetCart.backend.domain.report.dto;

import com.violetCart.backend.domain.report.enums.ReportReason;
import com.violetCart.backend.domain.report.enums.ReportStatus;
import com.violetCart.backend.domain.report.enums.ReportType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReportResponse {
    private Long id;
    private Long reporterId;
    private String reporterEmail;
    private ReportType reportType;

    // Target details
    private Long reportedUserId;
    private String reportedUserName;
    private Long reportedProductId;
    private String reportedProductTitle;

    private ReportReason reason;
    private String description;
    private ReportStatus status;
    private String adminNotes;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}