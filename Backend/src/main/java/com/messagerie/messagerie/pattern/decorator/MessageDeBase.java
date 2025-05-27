package com.messagerie.messagerie.pattern.decorator;

public class MessageDeBase implements MessageDecore {

    private String contenu;

    public MessageDeBase(String contenu) {
        this.contenu = contenu;
    }

    @Override
    public String getContenu() {
        return contenu;
    }

}
