package com.messagerie.messagerie.service;

import com.messagerie.messagerie.model.Groupes;
import com.messagerie.messagerie.model.Messages;
import com.messagerie.messagerie.model.Utilisateurs;
import com.messagerie.messagerie.pattern.observer.Observable;
import com.messagerie.messagerie.pattern.observer.Observer;
import com.messagerie.messagerie.repository.UtilisateursRepository;
import com.messagerie.messagerie.repository.MessagesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public  class GroupeMessageService implements Observable {

    private final List<Observer> observateurs = new ArrayList<>();

    @Autowired
    private UtilisateursRepository utilisateursRepository;

    @Autowired
    private MessagesRepository messageRepository;

    @Override
    public void ajouterObserver(Observer o) {
        observateurs.add(o);
    }

    @Override
    public void supprimerObserver(Observer o) {
        observateurs.remove(o);
    }

    @Override
    public void notifier(String message) {
        for (Observer observer : observateurs) {
            observer.actualiser(message);
        }
    }

    public void envoyerMessageAuGroupe(Groupes groupe, Messages message) {

        messageRepository.save(message);

        observateurs.clear();

        for (String username : groupe.getMembres()) {
            Optional<Utilisateurs> utilisateurOpt = utilisateursRepository.findByNom(username);

            if (utilisateurOpt.isPresent()) {
                Utilisateurs utilisateur = utilisateurOpt.get();

                if (utilisateur instanceof Observer) {
                    ajouterObserver((Observer) utilisateur);
                }
            }
        }

        notifier(message.getContenu());
    }

}
