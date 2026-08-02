package com.violetCart.backend.domain.report.controller;

import com.violetCart.backend.domain.report.dto.CreateReportRequest;
import com.violetCart.backend.domain.report.dto.ReportResponse;
import com.violetCart.backend.domain.report.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ReportResponse> submitReport(
            @RequestHeader("X-User-Id") Long reporterId, // Or extract via Spring Security @AuthenticationPrincipal
            @Valid @RequestBody CreateReportRequest request) {

        ReportResponse response = reportService.createReport(reporterId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}