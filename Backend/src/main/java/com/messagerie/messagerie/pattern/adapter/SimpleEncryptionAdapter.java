package com.messagerie.messagerie.pattern.adapter;

public class SimpleEncryptionAdapter implements Standard {
    private final byte key = 0x5A;
//XOR
    @Override
    public byte[] chiffrer(byte[] data) {
        byte[] result = new byte[data.length];
        for(int i = 0; i < data.length; i++) {
            result[i] = (byte)(data[i] ^ key);
        }
        return result;
    }

    @Override
    public byte[] dechiffrer(byte[] data) {
        // XOR is symmetric
        return chiffrer(data);
    }
}
