package com.messagerie.messagerie;

import com.messagerie.messagerie.pattern.adapter.*;

import java.util.Arrays;

public class AdapterTest {
    public static void main(String[] args) throws Exception {
        String message = "Ceuta is ours!";
        byte[] original = message.getBytes();

        System.out.println("== AES Test ==");
        Standard aes = new AESEncryptionAdapter();
        byte[] encryptedAES = aes.chiffrer(original);
        byte[] decryptedAES = aes.dechiffrer(encryptedAES);
        System.out.println("Decrypted AES: " + new String(encryptedAES));

        System.out.println("\n== RSA Test ==");
        Standard rsa = new RSAEncryptionAdapter();
        byte[] encryptedRSA = rsa.chiffrer(original);
        byte[] decryptedRSA = rsa.dechiffrer(encryptedRSA);
        System.out.println("Decrypted RSA: " + new String(encryptedAES));

        //cipher is easy no need to test it

    }

}
