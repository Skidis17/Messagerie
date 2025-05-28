package com.messagerie.messagerie.controller;

import com.messagerie.messagerie.model.*;
import com.messagerie.messagerie.pattern.adapter.SimpleEncryptionAdapter;
import com.messagerie.messagerie.pattern.adapter.Standard;
import com.messagerie.messagerie.repository.GroupesRepository;
import com.messagerie.messagerie.repository.MessagesRepository;
import com.messagerie.messagerie.repository.UtilisateursRepository;
import com.messagerie.messagerie.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "http://localhost:8081", allowCredentials = "true")
public class GroupController {

    @Autowired
    private GroupesRepository groupesRepository;

    @Autowired
    private UtilisateursRepository utilisateursRepository;

    @Autowired
    private MessagesRepository messagesRepository;

    @Autowired
    private MessageService messageService;

    @PostMapping
    public ResponseEntity<?> createGroup(@RequestBody Map<String, Object> payload, Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body("Not authenticated");
            }

            UserPrincipal currentUser = (UserPrincipal) authentication.getPrincipal();
            if (currentUser.getRole() != Role.commandant) {
                return ResponseEntity.status(403).body("Only commandants can create groups");
            }

            Utilisateurs commandant = utilisateursRepository.findByNom(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("Commandant not found"));

            Groupes group = new Groupes();
            group.setNom((String) payload.get("name"));
            group.setDescription((String) payload.get("description"));
            group.setCode((String) payload.get("code"));
            group.setCommandant(commandant);
            
            @SuppressWarnings("unchecked")
            List<String> memberIds = (List<String>) payload.get("members");
            group.setMembres(memberIds);

            return ResponseEntity.ok(groupesRepository.save(group));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getGroups(Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body("Not authenticated");
            }

            UserPrincipal currentUser = (UserPrincipal) authentication.getPrincipal();
            Utilisateurs user = utilisateursRepository.findByNom(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

            List<Groupes> groups;
            if (user.getRole() == Role.commandant) {
                groups = groupesRepository.findByCommandant(user);
            } else {
                groups = groupesRepository.findAll().stream()
                    .filter(group -> group.getMembres().contains(String.valueOf(user.getId())))
                    .toList();
            }

            return ResponseEntity.ok(groups);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{groupId}/messages")
    public ResponseEntity<?> sendGroupMessage(
            @PathVariable Integer groupId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body("Not authenticated");
            }

            UserPrincipal sender = (UserPrincipal) authentication.getPrincipal();
            Utilisateurs expediteur = utilisateursRepository.findByNom(sender.getUsername())
                .orElseThrow(() -> new RuntimeException("Sender not found"));

            Groupes group = groupesRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

            if (!Objects.equals(group.getCommandant().getId(), expediteur.getId()) &&
                !group.getMembres().contains(String.valueOf(expediteur.getId()))) {
                return ResponseEntity.status(403).body("Not a member of this group");
            }

            String content = (String) payload.get("content");

            Standard encryptionAdapter = new SimpleEncryptionAdapter();
            byte[] encryptedContent = encryptionAdapter.chiffrer(content.getBytes());

            // Create and save message
            Messages message = new Messages();
            message.setExpediteur(expediteur);
            message.setGroup(group);
            message.setContenu(new String(encryptedContent));
            message.setDateEnvoi(LocalDateTime.now());
            message.setType("group_message");

            // Get all group members for notification
            List<Utilisateurs> recipients = new ArrayList<>();
            for (String memberId : group.getMembres()) {
                utilisateursRepository.findById(Long.valueOf(memberId))
                    .ifPresent(recipients::add);
            }
            if (!recipients.contains(group.getCommandant())) {
                recipients.add(group.getCommandant());
            }

            // Save and notify
            Messages savedMessage = messagesRepository.save(message);
            messageService.envoyerMessage(savedMessage, recipients);

            return ResponseEntity.ok(Map.of("messageId", savedMessage.getId()));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{groupId}/messages")
    public ResponseEntity<?> getGroupMessages(@PathVariable Integer groupId, Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body("Not authenticated");
            }

            UserPrincipal currentUser = (UserPrincipal) authentication.getPrincipal();
            Utilisateurs user = utilisateursRepository.findByNom(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

            Groupes group = groupesRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

            if (!Objects.equals(group.getCommandant().getId(), user.getId()) &&
                !group.getMembres().contains(String.valueOf(user.getId()))) {
                return ResponseEntity.status(403).body("Not a member of this group");
            }

            List<Messages> messages = messagesRepository.findByGroupId(group);

            Standard decryptionAdapter = new SimpleEncryptionAdapter();
            messages.forEach(message -> {
                try {
                    byte[] decryptedContent = decryptionAdapter.dechiffrer(message.getContenu().getBytes());
                    message.setContenu(new String(decryptedContent));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });

            return ResponseEntity.ok(messages);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 