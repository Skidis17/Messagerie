package com.messagerie.messagerie.pattern.builder;

import com.messagerie.messagerie.model.Messages;

public class Director {
    private MessageBuilder builder;

    public Director(MessageBuilder builder) {
        this.builder = builder;
    }

    public Messages construct(String contenu) {
        builder.definirContenu(contenu);
        return builder.getResultat();
    }


}
