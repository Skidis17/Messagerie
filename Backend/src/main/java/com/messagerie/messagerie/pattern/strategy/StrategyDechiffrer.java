package com.messagerie.messagerie.pattern.strategy;

public interface StrategyDechiffrer {
    byte[] dechiffrer(byte[] data) throws Exception;
}
