package com.violetCart.backend.domain.user.service;

import com.violetCart.backend.domain.user.entity.StoreProfile;

public interface StoreProfileService {
    StoreProfile  findById(long id);
}
