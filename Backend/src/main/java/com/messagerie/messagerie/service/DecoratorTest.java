package com.messagerie.messagerie.service;

import com.messagerie.messagerie.pattern.decorator.DecorateurHorodatage;
import com.messagerie.messagerie.pattern.decorator.DecorateurSignature;
import com.messagerie.messagerie.pattern.decorator.MessageDeBase;
import com.messagerie.messagerie.pattern.decorator.MessageDecore;

public class DecoratorTest {
    public static void main(String[] args) {
        // Message simple
        MessageDecore message = new MessageDeBase("La mission est commencee");

        // Ajout de la signature
        message = new DecorateurSignature(message);

        // Ajout de l'horodatage
        message = new DecorateurHorodatage(message);

        System.out.println(message.getContenu());
    }
}
