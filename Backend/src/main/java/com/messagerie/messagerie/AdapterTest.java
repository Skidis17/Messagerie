package com.messagerie.messagerie;

import com.messagerie.messagerie.pattern.adapter.Adapter;
import com.messagerie.messagerie.pattern.adapter.SimpleEncryptionAdapter;
import com.messagerie.messagerie.pattern.adapter.Standard;


public class AdapterTest {

    public static void main(String[] args) throws Exception {
        String message = "Mission is completed comradess";

        // Soldat -> Soldat (AES)
        Standard soldatToSoldat = new Adapter("AES");
        testEncryption("Soldat -> Soldat (AES)", soldatToSoldat, message);

        // Commandant -> Soldat (RSA)
        Standard commandantToSoldat = new Adapter("RSA");
        testEncryption("Commandant -> Soldat (RSA)", commandantToSoldat, message);

        // Commandant -> Groupe (No encryption)
        Standard commandantToGroupe = new SimpleEncryptionAdapter();
        testEncryption("Commandant -> Groupe (Simple XOR)", commandantToGroupe, message);
    }

    private static void testEncryption(String description, Standard adapter, String message) throws Exception {
        System.out.println("--- " + description + " ---");
        byte[] encrypted = adapter.chiffrer(message.getBytes());
        System.out.println("Encrypted (hex): " + bytesToHex(encrypted));
        byte[] decrypted = adapter.dechiffrer(encrypted);
        System.out.println("Decrypted: " + new String(decrypted));
        System.out.println();
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02X ", b));
        }
        return sb.toString();
    }
}

