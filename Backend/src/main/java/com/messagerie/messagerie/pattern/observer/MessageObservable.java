package com.messagerie.messagerie.pattern.observer;

import com.messagerie.messagerie.model.Utilisateurs;

import java.beans.Transient;
import java.util.ArrayList;
import java.util.List;

public class MessageObservable implements Observable {

    private List<Observer> observers = new ArrayList<>();

    @Override
    public void ajouterObserver(Observer o) {
        observers.add(o);
    }

    @Override
    public void supprimerObserver(Observer o) {
        observers.remove(o);
    }

    @Override
    public void notifier(String message) {
        for (Observer o : observers) {
            o.actualiser(message);
        }
    }
}

