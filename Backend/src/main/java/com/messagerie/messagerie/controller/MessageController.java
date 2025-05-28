package com.messagerie.messagerie.controller;

import com.messagerie.messagerie.model.*;
import com.messagerie.messagerie.pattern.adapter.Adapter;
import com.messagerie.messagerie.pattern.adapter.SimpleEncryptionAdapter;
import com.messagerie.messagerie.pattern.adapter.Standard;
import com.messagerie.messagerie.repository.MessagesRepository;
import com.messagerie.messagerie.repository.UtilisateursRepository;
import com.messagerie.messagerie.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:8081", allowCredentials = "true", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class MessageController {

    @Autowired
    private MessagesRepository messagesRepository;

    @Autowired
    private UtilisateursRepository utilisateursRepository;

    @Autowired
    private MessageService messageService;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, Object> payload, Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body("Not authenticated");
            }

            UserPrincipal sender = (UserPrincipal) authentication.getPrincipal();
            Utilisateurs expediteur = utilisateursRepository.findByNom(sender.getUsername())
                .orElseThrow(() -> new RuntimeException("Sender not found"));

            String content = (String) payload.get("content");
            Long destinataireId = Long.valueOf(payload.get("destinataireId").toString());
            
            Utilisateurs destinataire = utilisateursRepository.findById(destinataireId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

            Standard encryptionAdapter;
            if (expediteur.getRole() == Role.commandant && destinataire.getRole() == Role.soldat) {
                encryptionAdapter = new Adapter("RSA"); // Commandant to Soldat
            } else if (expediteur.getRole() == Role.soldat && destinataire.getRole() == Role.soldat) {
                encryptionAdapter = new Adapter("AES"); // Soldat to Soldat
            } else {
                encryptionAdapter = new SimpleEncryptionAdapter(); // Default encryption
            }

            byte[] encryptedContent = encryptionAdapter.chiffrer(content.getBytes());

            Messages message = new Messages();
            message.setExpediteur(expediteur);
            message.setDestinataire(destinataire);
            message.setContenu(new String(encryptedContent));
            message.setDateEnvoi(LocalDateTime.now());
            message.setType(expediteur.getRole() + "_to_" + destinataire.getRole());

            Messages savedMessage = messagesRepository.save(message);
            messageService.envoyerMessage(savedMessage, List.of(destinataire));

            return ResponseEntity.ok(Map.of("messageId", savedMessage.getId()));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/conversation/{userId}")
    public ResponseEntity<?> getConversation(@PathVariable Long userId, Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body("Not authenticated");
            }

            UserPrincipal currentUser = (UserPrincipal) authentication.getPrincipal();
            Utilisateurs user1 = utilisateursRepository.findByNom(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("Current user not found"));
            
            Utilisateurs user2 = utilisateursRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Other user not found"));

            List<Messages> messages = messagesRepository.findAll().stream()
                .filter(m -> (m.getExpediteur().getId() == user1.getId() && m.getDestinataire().getId() == user2.getId()) ||
                           (m.getExpediteur().getId() == user2.getId() && m.getDestinataire().getId() == user1.getId()))
                .toList();

            messages.forEach(message -> {
                try {
                    Standard decryptionAdapter;
                    if (message.getType().contains("commandant_to_soldat")) {
                        decryptionAdapter = new Adapter("RSA");
                    } else if (message.getType().contains("soldat_to_soldat")) {
                        decryptionAdapter = new Adapter("AES");
                    } else {
                        decryptionAdapter = new SimpleEncryptionAdapter();
                    }
                    
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

    @GetMapping("/received")
    public ResponseEntity<?> getReceivedMessages(Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body("Not authenticated");
            }

            UserPrincipal currentUser = (UserPrincipal) authentication.getPrincipal();
            Utilisateurs user = utilisateursRepository.findByNom(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

            List<Messages> messages = messagesRepository.findByDestinataire(user);
            
            // Decrypt messages
            messages.forEach(message -> {
                try {
                    Standard decryptionAdapter;
                    if (message.getType().contains("commandant_to_soldat")) {
                        decryptionAdapter = new Adapter("RSA");
                    } else if (message.getType().contains("soldat_to_soldat")) {
                        decryptionAdapter = new Adapter("AES");
                    } else {
                        decryptionAdapter = new SimpleEncryptionAdapter();
                    }
                    
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
