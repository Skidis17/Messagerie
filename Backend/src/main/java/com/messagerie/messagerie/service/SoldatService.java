package com.messagerie.messagerie.service;

import com.messagerie.messagerie.model.Messages;
import com.messagerie.messagerie.model.Utilisateurs;
import org.springframework.stereotype.Service;

@Service
public class SoldatService {

    private final Utilisateurs utilisateur;

    public SoldatService(Utilisateurs utilisateur) {
        this.utilisateur = utilisateur;
    }

    public void seConnecter() {
        System.out.println("[Soldat] " + utilisateur.getNom() + " connecté.");
    }

    public void envoyerMessageGroupe(String contenu) {
        System.out.println("[Soldat] Envoi d'un message de groupe : " + contenu);
    }

    public void envoyerMessage(Utilisateurs destinataire, String contenu) {
        System.out.println("[Soldat] Envoi à " + destinataire.getNom() + " : " + contenu);
    }

    public String dechiffrerMessage(String mes) {
        return "Déchiffré: " + mes;
    }

    public void consulterInterface() {
        System.out.println("[Soldat] Interface de communication.");
    }

    public void actualiser(String message) {
        utilisateur.actualiser(message);
    }
}
