package com.messagerie.messagerie.service;

import com.messagerie.messagerie.model.Utilisateurs;
import com.messagerie.messagerie.repository.UtilisateursRepository;
import org.springframework.stereotype.Service;

@Service
public class CommandantService {

    private final UtilisateursRepository utilisateursRepository;

    public CommandantService(UtilisateursRepository utilisateursRepository) {
        this.utilisateursRepository = utilisateursRepository;
    }

    public Utilisateurs getById(Long id) {
        return utilisateursRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur not found"));
    }

    public void seConnecter(Utilisateurs utilisateur) {
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

    public void actualiser(Utilisateurs utilisateur, String message) {
        utilisateur.actualiser(message);
    }
}
