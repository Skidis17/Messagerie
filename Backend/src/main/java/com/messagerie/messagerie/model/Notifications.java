package com.messagerie.messagerie.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "notifications")
public class Notifications {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Utilisateurs utilisateur;

    @ManyToOne
    @JoinColumn(name = "message_id", nullable = false)
    private Messages message;

    private boolean vue;
    private LocalDateTime dateCreation;

}
