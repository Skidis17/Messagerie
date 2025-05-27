package com.messagerie.messagerie.service;

import com.messagerie.messagerie.model.Messages;
import com.messagerie.messagerie.model.Utilisateurs;
import org.springframework.stereotype.Service;

@Service
public class CommandantService {

    private final Utilisateurs utilisateur;

    public CommandantService(Utilisateurs utilisateur) {
        this.utilisateur = utilisateur;
    }

    public void seConnecter() {
        System.out.println("[Commandant] " + utilisateur.getNom() + " connecté.");
    }

    public void envoyerMessageGroupe(String contenu) {
        System.out.println("[Commandant] Envoi d'un message de groupe : " + contenu);
        // ici on créerait un message avec un groupe ciblé
    }

    public void envoyerMessageSoldat(Utilisateurs soldat, String contenu) {
        System.out.println("[Commandant] Envoi à soldat " + soldat.getNom() + " : " + contenu);
    }

    public void gererGroupe() {
        System.out.println("[Commandant] Gère les groupes.");
    }

    public void consulterHistorique() {
        System.out.println("[Commandant] Consulter l'historique des messages.");
    }

    public String dechiffrerMessage(String mes) {
        // Mock de déchiffrement
        return "Déchiffré: " + mes;
    }

    public void consulterInterface() {
        System.out.println("[Commandant] Accès à l'interface commandant.");
    }

    public void actualiser(String message) {
        utilisateur.actualiser(message);
    }
}
