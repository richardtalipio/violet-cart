package com.violetCart.backend.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class InvalidJwtException extends RuntimeException {

    public InvalidJwtException() {
        super("Invalid or expired JWT token");
    }

    public InvalidJwtException(String message) {
        super(message);
    }
}