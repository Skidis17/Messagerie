//package com.messagerie.messagerie.pattern.strategy;
//
//
//import com.messagerie.messagerie.pattern.adapter.SimpleEncryptionAdapter;
//import com.messagerie.messagerie.pattern.adapter.Standard;
//import com.messagerie.messagerie.pattern.adapter.AESEncryptionAdapter;
//
//public class ChiffrementCommandant implements StrategyChiffrement  {
//    private final Standard adapter = new SimpleEncryptionAdapter();
//
//    public byte[] chiffrer(String message) throws Exception {
//        return adapter.chiffrer(message.getBytes());
//    }
//
//
//}
