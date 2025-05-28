package com.messagerie.messagerie.controller;

import com.messagerie.messagerie.model.Role;
import com.messagerie.messagerie.model.UserPrincipal;
import com.messagerie.messagerie.model.Utilisateurs;
import com.messagerie.messagerie.repository.UtilisateursRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:8081", allowCredentials = "true")
public class UtilisateursController {

    @Autowired
    private UtilisateursRepository utilisateursRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return ResponseEntity.ok(Map.of(
            "id", userPrincipal.getCode(),
            "username", userPrincipal.getUsername(),
            "role", userPrincipal.getRole()
        ));
    }

    @GetMapping("/soldiers")
    public ResponseEntity<List<Utilisateurs>> getAllSoldiers() {
        List<Utilisateurs> soldiers = utilisateursRepository.findAll()
            .stream()
            .filter(user -> user.getRole() == Role.soldat)
            .toList();
        return ResponseEntity.ok(soldiers);
    }

    @GetMapping("/commandants")
    public ResponseEntity<List<Utilisateurs>> getAllCommandants() {
        List<Utilisateurs> commandants = utilisateursRepository.findAll()
            .stream()
            .filter(user -> user.getRole() == Role.commandant)
            .toList();
        return ResponseEntity.ok(commandants);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Utilisateurs> getUserById(@PathVariable Long id) {
        return utilisateursRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
} 