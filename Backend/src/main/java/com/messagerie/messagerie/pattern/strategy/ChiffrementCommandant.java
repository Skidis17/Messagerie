package com.messagerie.messagerie.pattern.strategy;

import com.messagerie.messagerie.pattern.adapter.RSAEncryptionAdapter;
import com.messagerie.messagerie.pattern.adapter.Standard;

public class ChiffrementCommandant implements StrategyChiffrer, StrategyDechiffrer {
    private final Standard adapter;

    public ChiffrementCommandant() throws Exception {
        this.adapter = new RSAEncryptionAdapter();
    }

    @Override
    public byte[] chiffrer(byte[] data) throws Exception {
        return adapter.chiffrer(data);
    }

    @Override
    public byte[] dechiffrer(byte[] data) throws Exception {
        return adapter.dechiffrer(data);
    }
}
