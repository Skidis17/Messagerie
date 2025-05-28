package com.messagerie.messagerie.pattern.strategy;

public interface StrategyChiffrer {
    byte[] chiffrer(byte[] data) throws Exception;
}

