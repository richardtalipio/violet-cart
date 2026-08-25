package com.violetCart.backend.domain.order.repository;

import com.violetCart.backend.domain.order.dto.OrderSearchCriteria;
import com.violetCart.backend.domain.order.entity.Order;
import com.violetCart.backend.domain.order.entity.OrderItem;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class OrderSpecification {

    public static Specification<Order> build(OrderSearchCriteria criteria, Long storeProfileIdForSeller, Long userAccountIdForCustomer) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (query != null) {
                query.distinct(true);
            }

            if (storeProfileIdForSeller != null) {
                Join<Order, OrderItem> orderItemJoin = root.join("orderItems");
                // Access scalar field directly
                predicates.add(cb.equal(orderItemJoin.get("storeProfileId"), storeProfileIdForSeller));
            } else if (userAccountIdForCustomer != null) {
                predicates.add(cb.equal(root.get("userAccountId"), userAccountIdForCustomer));
            }

            if (criteria != null) {
                if (StringUtils.hasText(criteria.getCustomerName())) {
                    predicates.add(cb.like(cb.lower(root.get("customerName")), "%" + criteria.getCustomerName().toLowerCase() + "%"));
                }

                if (criteria.getOrderStatus() != null) {
                    predicates.add(cb.equal(root.get("orderStatus"), criteria.getOrderStatus()));
                }

                if (criteria.getUserAccountId() != null && storeProfileIdForSeller != null) {
                    predicates.add(cb.equal(root.get("userAccountId"), criteria.getUserAccountId()));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}