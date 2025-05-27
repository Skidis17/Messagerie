package com.messagerie.messagerie.model;


import com.messagerie.messagerie.pattern.observer.Observable;
import com.messagerie.messagerie.pattern.observer.Observer;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "messages")
public class Messages implements Observable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Utilisateurs getExpediteur() {
        return expediteur;
    }

    public void setExpediteur(Utilisateurs expediteur) {
        this.expediteur = expediteur;
    }

    public Utilisateurs getDestinataire() {
        return destinataire;
    }

    public void setDestinataire(Utilisateurs destinataire) {
        this.destinataire = destinataire;
    }

    public Groupes getGroup() {
        return group;
    }

    public void setGroup(Groupes group) {
        this.group = group;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public LocalDateTime getDateEnvoi() {
        return dateEnvoi;
    }

    public void setDateEnvoi(LocalDateTime dateEnvoi) {
        this.dateEnvoi = dateEnvoi;
    }

    public List<Observer> getObservers() {
        return observers;
    }

    public void setObservers(List<Observer> observers) {
        this.observers = observers;
    }

    @ManyToOne
    @JoinColumn(name = "expediteur", nullable = false)
    private Utilisateurs expediteur;

    @ManyToOne
    @JoinColumn(name = "destinataire")
    private Utilisateurs destinataire;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private Groupes group;

    private String type;
    private String contenu;
    private LocalDateTime dateEnvoi;

    @Transient // Don't persist this list
    private List<Observer> observers = new ArrayList<>();

    @Override
    public void ajouterObserver(Observer observer) {
        observers.add(observer);
    }

    @Override
    public void supprimerObserver(Observer observer) {
        observers.remove(observer);
    }

    @Override
    public void notifier(String message) {
        for (Observer o : observers) {
            o.actualiser(message);
        }
    }
    // When sending a message, call notifier()
    public void envoyerNotification() {
        // some logic to save message or trigger sending
        notifier("Nouveau message de " + expediteur.getNom() + " à " +
                (destinataire != null ? destinataire.getNom() : "groupe"));
    }
}