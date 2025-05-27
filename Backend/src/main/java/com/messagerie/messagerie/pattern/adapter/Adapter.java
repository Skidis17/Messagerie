package com.messagerie.messagerie.pattern.adapter;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.*;

public class Adapter implements Standard {
    private String algorithm;
    private SecretKey aesKey;
    private KeyPair rsaKeyPair;

    public Adapter(String algorithm) throws Exception {
        this.algorithm = algorithm.toUpperCase();
        if ("AES".equals(this.algorithm)) {
            KeyGenerator keyGen = KeyGenerator.getInstance("AES");
            keyGen.init(128);
            aesKey = keyGen.generateKey();
        } else if ("RSA".equals(this.algorithm)) {
            KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance("RSA");
            keyPairGen.initialize(2048);
            rsaKeyPair = keyPairGen.generateKeyPair();
        } else {
            throw new IllegalArgumentException("Unsupported algorithm: " + algorithm);
        }
    }

    @Override
    public byte[] chiffrer(byte[] data) throws Exception {
        Cipher cipher = null;
        if ("AES".equals(algorithm)) {
            cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE, aesKey);
        } else if ("RSA".equals(algorithm)) {
            cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.ENCRYPT_MODE, rsaKeyPair.getPublic());
        }
        return cipher.doFinal(data);
    }

    @Override
    public byte[] dechiffrer(byte[] data) throws Exception {
        Cipher cipher = null;
        if ("AES".equals(algorithm)) {
            cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.DECRYPT_MODE, aesKey);
        } else if ("RSA".equals(algorithm)) {
            cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.DECRYPT_MODE, rsaKeyPair.getPrivate());
        }
        return cipher.doFinal(data);
    }
}

