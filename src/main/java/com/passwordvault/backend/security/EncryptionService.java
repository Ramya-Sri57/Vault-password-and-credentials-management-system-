package com.passwordvault.backend.security;

import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Service
public class EncryptionService {


    private static final String SECRET_KEY = "MySecretKey12345";


    private SecretKeySpec getKey() {

        return new SecretKeySpec(
                SECRET_KEY.getBytes(),
                "AES"
        );

    }


    public String encrypt(String data) {

        try {

            Cipher cipher = Cipher.getInstance("AES");

            cipher.init(
                    Cipher.ENCRYPT_MODE,
                    getKey()
            );


            byte[] encrypted =
                    cipher.doFinal(data.getBytes());


            return Base64.getEncoder()
                    .encodeToString(encrypted);


        } catch (Exception e) {

            throw new RuntimeException(
                    "Encryption failed"
            );

        }

    }



    public String decrypt(String encryptedData) {

        try {

            Cipher cipher = Cipher.getInstance("AES");

            cipher.init(
                    Cipher.DECRYPT_MODE,
                    getKey()
            );


            byte[] decrypted =
                    cipher.doFinal(
                            Base64.getDecoder()
                                    .decode(encryptedData)
                    );


            return new String(decrypted);


        } catch (Exception e) {

            throw new RuntimeException(
                    "Decryption failed"
            );

        }

    }

}