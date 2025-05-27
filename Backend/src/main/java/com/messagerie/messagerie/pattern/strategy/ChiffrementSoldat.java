package com.messagerie.messagerie.pattern.strategy;

import com.messagerie.messagerie.pattern.adapter.Standard;
import com.messagerie.messagerie.pattern.adapter.SimpleEncryptionAdapter;

public class ChiffrementSoldat implements StrategyChiffrement {
    private final Standard adapter = new SimpleEncryptionAdapter();

    @Override
    public byte[] chiffrer(byte[] data) throws Exception {
        return adapter.chiffrer(data);
    }
}

