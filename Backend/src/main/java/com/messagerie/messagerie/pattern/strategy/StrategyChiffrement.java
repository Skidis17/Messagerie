package com.messagerie.messagerie.pattern.strategy;

public interface StrategyChiffrement {
    byte[] chiffrer(byte[] data) throws Exception;
}

