package com.messagerie.messagerie.pattern.strategy;

import com.messagerie.messagerie.pattern.adapter.SimpleEncryptionAdapter;
import com.messagerie.messagerie.pattern.adapter.Standard;

public class ChiffrementGroupe implements StrategyChiffrer, StrategyDechiffrer {
    private final Standard adapter;

    public ChiffrementGroupe() {
        this.adapter = new SimpleEncryptionAdapter();
    }

    @Override
    public byte[] chiffrer(byte[] data) throws Exception{
        return adapter.chiffrer(data);
    }

    @Override
    public byte[] dechiffrer(byte[] data) throws Exception{
        return adapter.dechiffrer(data);
    }
}
