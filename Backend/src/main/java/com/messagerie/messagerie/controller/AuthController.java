package com.messagerie.messagerie.controller;

import com.messagerie.messagerie.model.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/login")
public class AuthController {

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(Authentication auth) {
        Map<String, Object> user = new HashMap<>();

        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal)) {
            return user;
        }

        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();

        // Populate user info
        user.put("code", principal.getCode());
        user.put("nom", principal.getNom());
        user.put("role", principal.getRole());

        return user;
    }
}
