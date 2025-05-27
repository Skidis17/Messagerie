package com.messagerie.messagerie.pattern.adapter;

public interface Standard {
    byte[] chiffrer(byte[] data) throws Exception;
    byte[] dechiffrer(byte[] data) throws Exception;
}
