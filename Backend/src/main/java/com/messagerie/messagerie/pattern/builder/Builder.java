package com.messagerie.messagerie.pattern.builder;

import com.messagerie.messagerie.model.Messages;

public interface Builder {
    void definirContenu(String contenu);
    Messages getResultat();
}
