package com.violetCart.backend.domain.user.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

/**
 * Lightweight UserDetails implementation used as the authenticated principal.
 * Stores the UserAccount id, email and (optionally) the storeProfile id for seller accounts.
 * This allows controllers to access user context without additional DB calls.
 */
@Getter
@Builder
@AllArgsConstructor
@ToString
public class CustomUserDetails implements UserDetails {

    private final Long id;
    private final String email;
    private final String password;
    private final Long storeProfileId;
    private final Role role;
    private final Collection<? extends GrantedAuthority> authorities;

    // --- UserDetails implementation ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    /**
     * Email is used as username in this app.
     */
    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    /**
     * Factory helper to construct CustomUserDetails from your JPA UserAccount entity.
     */
    public static CustomUserDetails fromUserAccount(UserAccount user) {
        Long profileId = null;
        StoreProfile sp = user.getStoreProfile();
        if (sp != null) {
            profileId = sp.getId();
        }

        return CustomUserDetails.builder()
                .id(user.getId())
                .email(user.getEmail())
                .password(user.getPassword())
                .storeProfileId(profileId)
                .authorities(user.getAuthorities())
                .role(user.getRole())
                .build();
    }
}