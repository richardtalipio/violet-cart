package com.violetCart.backend.domain.user.entity;

public enum UserStatus {
    ACTIVE,
    PENDING_APPROVAL, // Great for sellers awaiting admin approval
    BANNED
}