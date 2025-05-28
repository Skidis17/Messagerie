package com.messagerie.messagerie;

import com.messagerie.messagerie.model.Messages;
import com.messagerie.messagerie.pattern.builder.Director;
import com.messagerie.messagerie.pattern.builder.MessageBuilder;


public class BuilderTest {
    public static void main(String[] args) {

        // builder et director
        MessageBuilder builder = new MessageBuilder();
        Director directeur = new Director(builder);

        // Use director to build a message with some text
        Messages message = directeur.construct("Testing msg");

        // Check if the message content is correctly set
        if ("Ceci est un message test".equals(message.getContenu())) {
            System.out.println("Builder works! Message content: " + message.getContenu());
        } else {
            System.out.println("Builder failed. Content: " + message.getContenu());
        }
    }

}
