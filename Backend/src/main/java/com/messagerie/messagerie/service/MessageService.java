package com.messagerie.messagerie.service;

import com.messagerie.messagerie.model.Messages;
import com.messagerie.messagerie.model.Utilisateurs;
import com.messagerie.messagerie.repository.MessagesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessagesRepository messagesRepository;

    public Messages envoyerMessage(Messages message, List<Utilisateurs> destinataires) {
        // Save message in DB
        Messages savedMessage = messagesRepository.save(message);

        for (Utilisateurs destinataire : destinataires) {
            savedMessage.ajouterObserver(destinataire);
        }

        savedMessage.envoyerNotification();

        return savedMessage;
    }

    public List<Messages> getMessagesByDestinataire(Utilisateurs destinataire) {
        return messagesRepository.findByDestinataire(destinataire);
    }

    public List<Messages> getMessagesByExpediteur(Utilisateurs expediteur) {
        return messagesRepository.findByExpediteur(expediteur);
    }
}
