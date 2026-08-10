package com.violetCart.backend.domain.user.dto.request;

import com.violetCart.backend.domain.user.entity.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateStatusRequest {

    @NotNull(message = "Status is required")
    private UserStatus status;
}