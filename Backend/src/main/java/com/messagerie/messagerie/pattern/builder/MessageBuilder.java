package com.messagerie.messagerie.pattern.builder;

import com.messagerie.messagerie.model.Messages;

public class MessageBuilder implements Builder{
    private Messages message;

    public MessageBuilder() {
        this.message = new Messages();
    }

    @Override
    public void definirContenu(String contenu) {
        message.setContenu(contenu);
        message.setType("message");
    }

    @Override
    public Messages getResultat() {
        return message;
    }
}
