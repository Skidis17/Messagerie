package com.messagerie.messagerie.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Setter
@Getter
public class Groupe_messagesId implements Serializable {

    // Getters and setters
    private Integer utilisateur; // Must match type & name of @Id fields in entity
    private Integer groupe;

    // Default constructor
    public Groupe_messagesId() {}

    // Optional: Constructor with parameters
    public Groupe_messagesId(Integer utilisateur, Integer groupe) {
        this.utilisateur = utilisateur;
        this.groupe = groupe;
    }

    // equals and hashCode are required
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Groupe_messagesId)) return false;
        Groupe_messagesId that = (Groupe_messagesId) o;
        return Objects.equals(utilisateur, that.utilisateur) &&
                Objects.equals(groupe, that.groupe);
    }

    @Override
    public int hashCode() {
        return Objects.hash(utilisateur, groupe);
    }
}