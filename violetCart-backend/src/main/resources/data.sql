INSERT IGNORE INTO users (first_name, last_name, email, password, role, status, store_description, created_at, updated_at)
VALUES
('System', 'Admin', 'admin@violetcart.com', '$2a$10$e8p.mP1Uv91I8Nq5Bv7IJuL33GZzD1S7W1X3yG2M9k8Q8y5X3L1mC', 'ROLE_ADMIN', 'ACTIVE', NULL, NOW(), NOW()),
('Jane', 'Doe', 'customer@violetcart.com', '$2a$10$e8p.mP1Uv91I8Nq5Bv7IJuL33GZzD1S7W1X3yG2M9k8Q8y5X3L1mC', 'ROLE_CUSTOMER', 'ACTIVE', NULL, NOW(), NOW()),
('John', 'Smith', 'seller@violetcart.com', '$2a$10$e8p.mP1Uv91I8Nq5Bv7IJuL33GZzD1S7W1X3yG2M9k8Q8y5X3L1mC', 'ROLE_SELLER', 'PENDING_APPROVAL', 'I sell custom mechanical keyboards.', NOW(), NOW());