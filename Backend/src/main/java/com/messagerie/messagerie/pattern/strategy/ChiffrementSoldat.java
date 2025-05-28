package com.messagerie.messagerie.pattern.strategy;

import com.messagerie.messagerie.pattern.adapter.AESEncryptionAdapter;
import com.messagerie.messagerie.pattern.adapter.Standard;

public class ChiffrementSoldat implements StrategyChiffrer, StrategyDechiffrer {
    private final Standard adapter;

    public ChiffrementSoldat() throws Exception {
        this.adapter = new AESEncryptionAdapter();
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


