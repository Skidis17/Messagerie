package com.messagerie.messagerie;

import com.messagerie.messagerie.model.Messages;
import com.messagerie.messagerie.model.Utilisateurs;

public class ObserverTest {

    public static void main(String[] args) {

        // Create users (observers)
        Utilisateurs user1 = new Utilisateurs();
        user1.setNom("Soldat Jean");

        Utilisateurs user2 = new Utilisateurs();
        user2.setNom("sadki ");

        // Create a message (observable)
        Messages message = new Messages();
        message.setExpediteur(user2); // Commandant Pierre sends the message

        // Add observers (the users who will be notified)
        message.ajouterObserver(user1);
        message.ajouterObserver(user2);

        // Trigger notification
        message.envoyerNotification(); // This calls notifier() which calls actualiser() on observers
    }
}
