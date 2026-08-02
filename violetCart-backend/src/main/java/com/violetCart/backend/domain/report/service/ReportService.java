package com.violetCart.backend.domain.report.service;

import com.violetCart.backend.domain.report.dto.CreateReportRequest;
import com.violetCart.backend.domain.report.dto.ReportResponse;
import com.violetCart.backend.domain.report.dto.ResolveReportRequest;
import com.violetCart.backend.domain.report.enums.ReportStatus;
import com.violetCart.backend.domain.report.enums.ReportType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReportService {

    ReportResponse createReport(Long reporterId, CreateReportRequest request);
    Page<ReportResponse> getReports(ReportType type, ReportStatus status, Pageable pageable);
    ReportResponse getReportById(Long reportId);
    ReportResponse banUserAndResolveReports(Long userId, ResolveReportRequest dto);
    ReportResponse delistProductAndResolveReports(Long productId, ResolveReportRequest dto);
    ReportResponse dismissReport(Long reportId, ResolveReportRequest dto);
    long countOpenReports();


}