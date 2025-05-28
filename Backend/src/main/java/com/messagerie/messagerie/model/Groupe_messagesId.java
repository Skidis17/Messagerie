package com.messagerie.messagerie.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Setter
@Getter
public class Groupe_messagesId implements Serializable {

    private Integer utilisateur;
    private Integer groupe;

    public Groupe_messagesId() {}

    public Groupe_messagesId(Integer utilisateur, Integer groupe) {
        this.utilisateur = utilisateur;
        this.groupe = groupe;
    }

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