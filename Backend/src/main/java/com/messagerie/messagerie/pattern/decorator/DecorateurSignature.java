package com.messagerie.messagerie.pattern.decorator;

public class DecorateurSignature extends Decorator {

    public DecorateurSignature(MessageDecore messageDecore) {
        super(messageDecore);
    }

    @Override
    public String getContenu() {

        return super.getContenu() + " [Chef d'Armee Skidis]";
    }
}
