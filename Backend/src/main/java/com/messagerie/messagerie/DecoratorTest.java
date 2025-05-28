package com.messagerie.messagerie;

import com.messagerie.messagerie.pattern.decorator.DecorateurHorodatage;
import com.messagerie.messagerie.pattern.decorator.DecorateurSignature;
import com.messagerie.messagerie.pattern.decorator.MessageDeBase;
import com.messagerie.messagerie.pattern.decorator.MessageDecore;

public class DecoratorTest {
    public static void main(String[] args) {

        MessageDecore message = new MessageDeBase("La mission est commencee");

        message = new DecorateurSignature(message);

        message = new DecorateurHorodatage(message);

        System.out.println(message.getContenu());
    }
}
