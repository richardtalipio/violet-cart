package com.violetCart.backend.domain.user.service;

import com.violetCart.backend.domain.user.entity.StoreProfile;
import com.violetCart.backend.domain.user.repository.StoreProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.Store;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class StoreProfileServiceImpl implements StoreProfileService {

    private final StoreProfileRepository storeProfileRepository;

    @Override
    public StoreProfile findById(long id) {
        return storeProfileRepository.findById(id)
                .orElseThrow(() -> new com.violetCart.backend.common.exception.ResourceNotFoundException("Store Profile not found with id: " + id));
    }
}
