package com.messagerie.messagerie.pattern.adapter;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

public class AESEncryptionAdapter implements Standard {
    private final Cipher cipherEncrypt;
    private final Cipher cipherDecrypt;

    public AESEncryptionAdapter() throws Exception {
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(128);
        SecretKey key = keyGen.generateKey();
        cipherEncrypt = Cipher.getInstance("AES");
        cipherEncrypt.init(Cipher.ENCRYPT_MODE, key);
        cipherDecrypt = Cipher.getInstance("AES");
        cipherDecrypt.init(Cipher.DECRYPT_MODE, key);
    }

    public byte[] chiffrer(byte[] data) throws Exception {
        return cipherEncrypt.doFinal(data);
    }

    public byte[] dechiffrer(byte[] data) throws Exception {
        return cipherDecrypt.doFinal(data);
    }
}
