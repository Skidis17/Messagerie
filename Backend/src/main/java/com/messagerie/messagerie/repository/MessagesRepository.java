package com.messagerie.messagerie.repository;

import com.messagerie.messagerie.model.Groupes;
import com.messagerie.messagerie.model.Messages;
import com.messagerie.messagerie.model.Utilisateurs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessagesRepository extends JpaRepository<Messages, Integer> {
    List<Messages> findByExpediteur(Utilisateurs expediteur);
    List<Messages> findByDestinataire(Utilisateurs destinataire);
    List<Messages> findByGroupId(Groupes groupe);
}