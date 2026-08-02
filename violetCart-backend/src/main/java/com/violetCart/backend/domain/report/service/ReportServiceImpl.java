package com.violetCart.backend.domain.report.service;

import com.violetCart.backend.common.exception.ResourceNotFoundException;
import com.violetCart.backend.domain.product.entity.Product;
import com.violetCart.backend.domain.product.repository.ProductRepository;
import com.violetCart.backend.domain.report.dto.CreateReportRequest;
import com.violetCart.backend.domain.report.dto.ReportResponse;
import com.violetCart.backend.domain.report.dto.ResolveReportRequest;
import com.violetCart.backend.domain.report.entity.Report;
import com.violetCart.backend.domain.report.enums.ReportStatus;
import com.violetCart.backend.domain.report.enums.ReportType;
import com.violetCart.backend.domain.report.repository.ReportRepository;
import com.violetCart.backend.domain.user.entity.UserAccount;
import com.violetCart.backend.domain.user.entity.UserStatus;
import com.violetCart.backend.domain.user.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final UserAccountRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public ReportResponse createReport(Long reporterId, CreateReportRequest request) {
        UserAccount reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new ResourceNotFoundException("Reporter user not found with ID: " + reporterId));

        Report.ReportBuilder builder = Report.builder()
                .reporter(reporter)
                .reportType(request.getReportType())
                .reason(request.getReason())
                .description(request.getDescription())
                .status(ReportStatus.PENDING);

        if (request.getReportType() == ReportType.USER) {
            if (request.getReportedUserId() == null) {
                throw new IllegalArgumentException("reportedUserId is required when reportType is USER");
            }
            if (reporterId.equals(request.getReportedUserId())) {
                throw new IllegalArgumentException("You cannot report your own account");
            }
            UserAccount reportedUser = userRepository.findById(request.getReportedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Reported user not found with ID: " + request.getReportedUserId()));
            builder.reportedUser(reportedUser);

        } else if (request.getReportType() == ReportType.PRODUCT) {
            if (request.getReportedProductId() == null) {
                throw new IllegalArgumentException("reportedProductId is required when reportType is PRODUCT");
            }
            Product reportedProduct = productRepository.findById(request.getReportedProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Reported product not found with ID: " + request.getReportedProductId()));
            builder.reportedProduct(reportedProduct);
        }

        Report savedReport = reportRepository.save(builder.build());
        return mapToResponse(savedReport);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReportResponse> getReports(ReportType type, ReportStatus status, Pageable pageable) {
        ReportStatus filterStatus = (status != null) ? status : ReportStatus.PENDING;

        if (type != null) {
            return reportRepository.findByReportTypeAndStatus(type, filterStatus, pageable)
                    .map(this::mapToResponse);
        }

        return reportRepository.findByStatus(filterStatus, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ReportResponse getReportById(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with ID: " + reportId));
        return mapToResponse(report);
    }

    @Override
    @Transactional
    public ReportResponse banUserAndResolveReports(Long userId, ResolveReportRequest dto) {
        UserAccount user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setStatus(UserStatus.BANNED);
        userRepository.save(user);

        List<Report> pendingReports = reportRepository.findByReportedUserIdAndStatus(userId, ReportStatus.PENDING);
        for (Report report : pendingReports) {
            report.setStatus(ReportStatus.RESOLVED_BANNED);
            report.setAdminNotes(dto.getAdminNotes());
            report.setResolvedAt(LocalDateTime.now());
        }
        reportRepository.saveAll(pendingReports);

        return pendingReports.isEmpty() ? null : mapToResponse(pendingReports.get(0));
    }

    @Override
    @Transactional
    public ReportResponse delistProductAndResolveReports(Long productId, ResolveReportRequest dto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));

        product.setActive(false);
        productRepository.save(product);

        List<Report> pendingReports = reportRepository.findByReportedProductIdAndStatus(productId, ReportStatus.PENDING);
        for (Report report : pendingReports) {
            report.setStatus(ReportStatus.RESOLVED_ACTIONED);
            report.setAdminNotes(dto.getAdminNotes());
            report.setResolvedAt(LocalDateTime.now());
        }
        reportRepository.saveAll(pendingReports);

        return pendingReports.isEmpty() ? null : mapToResponse(pendingReports.get(0));
    }

    @Override
    @Transactional
    public ReportResponse dismissReport(Long reportId, ResolveReportRequest dto) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with ID: " + reportId));

        report.setStatus(ReportStatus.DISMISSED);
        report.setAdminNotes(dto.getAdminNotes());
        report.setResolvedAt(LocalDateTime.now());

        return mapToResponse(reportRepository.save(report));
    }

    @Override
    @Transactional(readOnly = true)
    public long countOpenReports() {
        return reportRepository.countByStatus(ReportStatus.PENDING);
    }

    private ReportResponse mapToResponse(Report report) {
        return ReportResponse.builder()
                .id(report.getId())
                .reporterId(report.getReporter().getId())
                .reporterEmail(report.getReporter().getEmail())
                .reportType(report.getReportType())
                .reportedUserId(report.getReportedUser() != null ? report.getReportedUser().getId() : null)
                .reportedUserName(report.getReportedUser() != null ?
                        report.getReportedUser().getFirstName() + " " + report.getReportedUser().getLastName() : null)
                .reportedProductId(report.getReportedProduct() != null ? report.getReportedProduct().getId() : null)
                .reportedProductTitle(report.getReportedProduct() != null ? report.getReportedProduct().getTitle() : null)
                .reason(report.getReason())
                .description(report.getDescription())
                .status(report.getStatus())
                .adminNotes(report.getAdminNotes())
                .createdAt(report.getCreatedAt())
                .resolvedAt(report.getResolvedAt())
                .build();
    }
}