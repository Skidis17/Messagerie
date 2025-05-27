package com.messagerie.messagerie.service;

import com.messagerie.messagerie.model.Utilisateurs;
import com.messagerie.messagerie.repository.UtilisateursRepository;
import org.springframework.stereotype.Service;

@Service
public class SoldatService {

    private final UtilisateursRepository utilisateursRepository;

    public SoldatService(UtilisateursRepository utilisateursRepository) {
        this.utilisateursRepository = utilisateursRepository;
    }

    public void seConnecter(Long utilisateurId) {
            Utilisateurs utilisateur = getUtilisateurById(utilisateurId);
        System.out.println("[Soldat] " + utilisateur.getNom() + " connecté.");
    }

    public void envoyerMessageGroupe(Long utilisateurId, String contenu) {
        Utilisateurs utilisateur = getUtilisateurById(utilisateurId);
        System.out.println("[Soldat] " + utilisateur.getNom() + " envoie un message de groupe : " + contenu);
    }

    public void envoyerMessage(Long expediteurId, Utilisateurs destinataire, String contenu) {
        Utilisateurs expediteur = getUtilisateurById(expediteurId);
        System.out.println("[Soldat] " + expediteur.getNom() + " envoie à " + destinataire.getNom() + " : " + contenu);
    }

    public String dechiffrerMessage(String mes) {
        return "Déchiffré: " + mes;
    }

    public void consulterInterface(Long utilisateurId) {
        Utilisateurs utilisateur = getUtilisateurById(utilisateurId);
        System.out.println("[Soldat] " + utilisateur.getNom() + " accède à l'interface de communication.");
    }

    public void actualiser(Long utilisateurId, String message) {
        Utilisateurs utilisateur = getUtilisateurById(utilisateurId);
        utilisateur.actualiser(message);
    }

    private Utilisateurs getUtilisateurById(Long id) {
        return utilisateursRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec ID: " + id));
    }
}
