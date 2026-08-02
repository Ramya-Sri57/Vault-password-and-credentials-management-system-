package com.passwordvault.backend.service;

import com.passwordvault.backend.entity.Credential;
import com.passwordvault.backend.entity.User;
import com.passwordvault.backend.repository.CredentialRepository;
import com.passwordvault.backend.security.EncryptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;


@Service
@RequiredArgsConstructor
public class CredentialService {


    private final CredentialRepository credentialRepository;

    private final EncryptionService encryptionService;



    public Credential save(Credential credential, User user) {


        credential.setUser(user);


        // Encrypt password before saving
        credential.setPassword(
                encryptionService.encrypt(
                        credential.getPassword()
                )
        );


        return credentialRepository.save(credential);

    }




    public List<Credential> getAll(User user) {

    System.out.println("Logged in User ID: " + user.getId());
    System.out.println("Logged in Email: " + user.getEmail());

    List<Credential> credentials =
            credentialRepository.findByUserId(user.getId());

    System.out.println("Credentials found: " + credentials.size());

    credentials.forEach(credential -> {

    String password = credential.getPassword();

    try {
        credential.setPassword(
                encryptionService.decrypt(password)
        );
    } catch (Exception e) {
        // Password is already plain text
        credential.setPassword(password);
    }

});

    return credentials;
}




    public ResponseEntity<?> getById(Long id, User user) {


        Optional<Credential> credential =
                credentialRepository.findById(id);



        if(credential.isPresent() &&
           credential.get().getUser().getId().equals(user.getId())) {


            Credential result = credential.get();


            result.setPassword(
                    encryptionService.decrypt(
                            result.getPassword()
                    )
            );


            return ResponseEntity.ok(result);

        }


        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Credential not found");

    }





    public void delete(Long id) {

        credentialRepository.deleteById(id);

    }




    public ResponseEntity<?> updateCredential(
            Long id,
            Credential updatedCredential,
            User user
    ) {


        Optional<Credential> existingCredential =
                credentialRepository.findById(id);



        if(existingCredential.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Credential not found");

        }




        Credential credential =
                existingCredential.get();




        if(!credential.getUser().getId().equals(user.getId())) {


            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Not allowed");

        }




        credential.setWebsite(
                updatedCredential.getWebsite()
        );


        credential.setUsername(
                updatedCredential.getUsername()
        );


        // Encrypt updated password
        credential.setPassword(
                encryptionService.encrypt(
                        updatedCredential.getPassword()
                )
        );


        credential.setNotes(
                updatedCredential.getNotes()
        );
        credential.setCategory(
        updatedCredential.getCategory()
);



        credentialRepository.save(credential);



        return ResponseEntity.ok(
                "Credential updated successfully"
        );

    }

}