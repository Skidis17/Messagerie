package com.messagerie.messagerie.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@IdClass(Groupe_messages.class)
public class Groupe_messages {

    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Utilisateurs utilisateur;

    @Id
    @ManyToOne
    @JoinColumn(name = "group_id")
    private Groupes groupe;

}
