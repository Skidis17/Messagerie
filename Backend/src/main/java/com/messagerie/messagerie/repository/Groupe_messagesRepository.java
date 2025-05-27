package com.messagerie.messagerie.repository;

import com.messagerie.messagerie.model.Groupe_messages;
import com.messagerie.messagerie.model.Groupe_messagesId;
import com.messagerie.messagerie.model.Groupes;
import com.messagerie.messagerie.model.Utilisateurs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface Groupe_messagesRepository extends JpaRepository<Groupe_messages, Groupe_messagesId> {

    List<Groupe_messages> findByUtilisateur(Utilisateurs utilisateur);

    List<Groupe_messages> findByGroupe(Groupes groupe);

    Optional<Groupe_messages> findByUtilisateurAndGroupe(Utilisateurs utilisateur, Groupes groupe);

    void deleteByUtilisateurAndGroupe(Utilisateurs utilisateur, Groupes groupe);
}
