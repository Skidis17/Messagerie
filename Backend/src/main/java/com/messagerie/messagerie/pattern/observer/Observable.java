package com.messagerie.messagerie.pattern.observer;

public interface Observable {
    void ajouterObserver(Observer o);
    void supprimerObserver(Observer o);
    void notifier(String message);
}