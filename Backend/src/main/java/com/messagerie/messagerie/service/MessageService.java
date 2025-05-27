package com.messagerie.messagerie.service;

import com.messagerie.messagerie.model.Messages;
import com.messagerie.messagerie.model.Utilisateurs;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    public void envoyerMessage(Messages message, List<Utilisateurs> destinataires) {
        // Save message in DB

        // Add observers (destinataires) to message observable
        for (Utilisateurs destinataire : destinataires) {
            message.ajouterObserver(destinataire);
        }

        // Notify all observers about the new message
        message.envoyerNotification();
    }
}
