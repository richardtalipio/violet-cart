package com.violetCart.backend.domain.report.controller;

import com.violetCart.backend.domain.report.dto.ReportResponse;
import com.violetCart.backend.domain.report.dto.ResolveReportRequest;
import com.violetCart.backend.domain.report.enums.ReportStatus;
import com.violetCart.backend.domain.report.enums.ReportType;
import com.violetCart.backend.domain.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/moderation")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminModerationController {

    private final ReportService reportService;

    @GetMapping("/reports")
    public ResponseEntity<Page<ReportResponse>> getReports(
            @RequestParam(required = false) ReportType type,
            @RequestParam(required = false, defaultValue = "PENDING") ReportStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ReportResponse> reports = reportService.getReports(type, status, pageable);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/reports/{id}")
    public ResponseEntity<ReportResponse> getReportById(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.getReportById(id));
    }

    @PostMapping("/users/{userId}/ban")
    public ResponseEntity<ReportResponse> banUserAndResolve(
            @PathVariable Long userId,
            @RequestBody ResolveReportRequest request) {

        ReportResponse response = reportService.banUserAndResolveReports(userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/products/{productId}/delist")
    public ResponseEntity<ReportResponse> delistProductAndResolve(
            @PathVariable Long productId,
            @RequestBody ResolveReportRequest request) {

        ReportResponse response = reportService.delistProductAndResolveReports(productId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reports/{reportId}/dismiss")
    public ResponseEntity<ReportResponse> dismissReport(
            @PathVariable Long reportId,
            @RequestBody ResolveReportRequest request) {

        ReportResponse response = reportService.dismissReport(reportId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats/open-count")
    public ResponseEntity<Long> getOpenReportCount() {
        return ResponseEntity.ok(reportService.countOpenReports());
    }
}