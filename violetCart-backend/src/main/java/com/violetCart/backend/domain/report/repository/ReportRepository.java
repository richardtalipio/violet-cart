package com.violetCart.backend.domain.report.repository;

import com.violetCart.backend.domain.report.entity.Report;
import com.violetCart.backend.domain.report.enums.ReportStatus;
import com.violetCart.backend.domain.report.enums.ReportType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    Page<Report> findByReportTypeAndStatus(ReportType reportType, ReportStatus status, Pageable pageable);

    Page<Report> findByStatus(ReportStatus status, Pageable pageable);

    List<Report> findByReportedUserIdAndStatus(Long reportedUserId, ReportStatus status);

    List<Report> findByReportedProductIdAndStatus(Long reportedProductId, ReportStatus status);

    long countByStatus(ReportStatus status);

    @Query("SELECT COUNT(r) FROM Report r WHERE r.reportedUser.id = :userId AND r.status = 'PENDING'")
    long countPendingReportsForUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(r) FROM Report r WHERE r.reportedProduct.id = :productId AND r.status = 'PENDING'")
    long countPendingReportsForProduct(@Param("productId") Long productId);
}