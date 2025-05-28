package com.messagerie.messagerie;

import com.messagerie.messagerie.pattern.strategy.*;

public class StrategyTest {
    public static void main(String[] args) throws Exception {
        String message = "Mission at 6PM.";
        byte[] data = message.getBytes();

        // Soldat
        StrategyChiffrer soldatChiffre = new ChiffrementSoldat();
        StrategyDechiffrer soldatDechiffre = (StrategyDechiffrer) soldatChiffre;

        byte[] encryptedSoldat = soldatChiffre.chiffrer(data);
        byte[] decryptedSoldat = soldatDechiffre.dechiffrer(encryptedSoldat);

        System.out.println("Soldat Decrypted: " + new String(encryptedSoldat));
        System.out.println("Soldat Decrypted: " + new String(decryptedSoldat));

        // Commandant
        StrategyChiffrer commandantChiffre = new ChiffrementCommandant();
        StrategyDechiffrer commandantDechiffre = (StrategyDechiffrer) commandantChiffre;

        byte[] encryptedCommandant = commandantChiffre.chiffrer(data);
        byte[] decryptedCommandant = commandantDechiffre.dechiffrer(encryptedCommandant);

        System.out.println("Commandant Decrypted: " + new String(encryptedCommandant));
        System.out.println("Commandant Decrypted: " + new String(decryptedCommandant));

        // Groupe
        StrategyChiffrer groupeChiffre = new ChiffrementGroupe();
        StrategyDechiffrer groupeDechiffre = (StrategyDechiffrer) groupeChiffre;

        byte[] encryptedGroupe = groupeChiffre.chiffrer(data);
        byte[] decryptedGroupe = groupeDechiffre.dechiffrer(encryptedGroupe);

        System.out.println("Groupe Decrypted: " + new String(encryptedGroupe));
        System.out.println("Groupe Decrypted: " + new String(decryptedGroupe));
    }
}
