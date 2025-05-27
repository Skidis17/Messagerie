package com.messagerie.messagerie.pattern.decorator;

public abstract class Decorator implements MessageDecore {

    protected MessageDecore messageDecore;

    public Decorator(MessageDecore messageDecoré) {
        this.messageDecore = messageDecoré;
    }

    @Override
    public String getContenu() {
        return messageDecore.getContenu();
    }
}
