package com.violetCart.backend.domain.report.dto;

import com.violetCart.backend.domain.report.enums.ReportReason;
import com.violetCart.backend.domain.report.enums.ReportType;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateReportRequest {

    @NotNull(message = "Report type is required")
    private ReportType reportType;

    private Long reportedUserId;    // Required if reportType == USER
    private Long reportedProductId; // Required if reportType == PRODUCT

    @NotNull(message = "Report reason is required")
    private ReportReason reason;

    private String description;
}