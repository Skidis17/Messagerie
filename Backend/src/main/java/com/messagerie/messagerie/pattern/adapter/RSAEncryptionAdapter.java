package com.messagerie.messagerie.pattern.adapter;

import javax.crypto.Cipher;
import java.security.KeyPair;
import java.security.KeyPairGenerator;

public class RSAEncryptionAdapter implements Standard {
    private final Cipher cipherEncrypt;
    private final Cipher cipherDecrypt;

    public RSAEncryptionAdapter() throws Exception {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
        keyGen.initialize(2048);
        KeyPair keyPair = keyGen.generateKeyPair();

        cipherEncrypt = Cipher.getInstance("RSA");
        cipherEncrypt.init(Cipher.ENCRYPT_MODE, keyPair.getPublic());

        cipherDecrypt = Cipher.getInstance("RSA");
        cipherDecrypt.init(Cipher.DECRYPT_MODE, keyPair.getPrivate());
    }

    public byte[] chiffrer(byte[] data) throws Exception {
        return cipherEncrypt.doFinal(data);
    }

    public byte[] dechiffrer(byte[] data) throws Exception {
        return cipherDecrypt.doFinal(data);
    }
}
