package com.violetCart.backend.domain.report.enums;

public enum ReportStatus {
    PENDING,
    RESOLVED_BANNED,    // Applied when banning a user
    RESOLVED_ACTIONED,  // Applied when delisting a product
    DISMISSED
}
