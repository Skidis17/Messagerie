package com.messagerie.messagerie.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {

    private final Utilisateurs user;

    public UserPrincipal(Utilisateurs user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
    }

    public int getCode() {
        return user.getCode();
    }

    public Role getRole() {
        return user.getRole();
    }

    public String getNom() {
        return user.getNom();
    }

    @Override
    public String getPassword() {
        return user.getMdp();
    }

    @Override
    public String getUsername() {
        return user.getNom();
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
}
