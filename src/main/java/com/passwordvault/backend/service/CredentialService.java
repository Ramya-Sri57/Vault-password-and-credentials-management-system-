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
import com.passwordvault.backend.dto.DashboardStatsResponse;
import java.util.HashSet;
import java.util.Set;
import com.passwordvault.backend.entity.SharedCredential;
import com.passwordvault.backend.repository.SharedCredentialRepository;
import com.passwordvault.backend.entity.AccessLevel;
@Service
@RequiredArgsConstructor
public class CredentialService {


    private final CredentialRepository credentialRepository;

    private final EncryptionService encryptionService;

    private final SharedCredentialRepository sharedCredentialRepository;

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

    Optional<Credential> existingCredential =
            credentialRepository.findById(id);

    if (existingCredential.isEmpty()) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Credential not found");
    }

    Credential credential = existingCredential.get();

    // Owner can always view
    if (credential.getUser().getId().equals(user.getId())) {

        credential.setPassword(
                encryptionService.decrypt(
                        credential.getPassword()
                )
        );

        return ResponseEntity.ok(credential);
    }

    // Check whether the credential was shared with this user
    Optional<SharedCredential> sharedCredential =
            sharedCredentialRepository
                    .findByCredentialAndSharedWith(
                            credential,
                            user
                    );

    if (sharedCredential.isEmpty()) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("You do not have access to this credential");
    }

    // VIEW, EDIT and FULL_ACCESS can all view
    credential.setPassword(
            encryptionService.decrypt(
                    credential.getPassword()
            )
    );

    return ResponseEntity.ok(credential);
}





    public ResponseEntity<?> delete(Long id, User user) {

    Optional<Credential> existingCredential =
            credentialRepository.findById(id);

    if (existingCredential.isEmpty()) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Credential not found");
    }

    Credential credential = existingCredential.get();

    // Owner has full access
    if (credential.getUser().getId().equals(user.getId())) {

        credentialRepository.delete(credential);

        return ResponseEntity.ok(
                "Credential deleted successfully"
        );
    }

    // Check shared access
    Optional<SharedCredential> sharedCredential =
            sharedCredentialRepository
                    .findByCredentialAndSharedWith(
                            credential,
                            user
                    );

    if (sharedCredential.isEmpty()) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("You do not have access to this credential");
    }

    AccessLevel accessLevel =
            sharedCredential.get().getAccessLevel();

    // Only FULL_ACCESS can delete
    if (accessLevel != AccessLevel.FULL_ACCESS) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("You do not have full access to delete this credential");
    }

    credentialRepository.delete(credential);

    return ResponseEntity.ok(
            "Credential deleted successfully"
    );
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




        // Owner has full access
if (credential.getUser().getId().equals(user.getId())) {

    // Owner can update normally

} else {

    // Check whether this credential was shared with the user
    Optional<SharedCredential> sharedCredential =
            sharedCredentialRepository
                    .findByCredentialAndSharedWith(
                            credential,
                            user
                    );

    if (sharedCredential.isEmpty()) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("You do not have access to this credential");

    }

    AccessLevel accessLevel =
            sharedCredential.get().getAccessLevel();

    // VIEW users cannot edit
    if (accessLevel == AccessLevel.VIEW) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("You only have view access to this credential");

    }

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

credential.setExpiryDate(
    updatedCredential.getExpiryDate()
);
        credentialRepository.save(credential);



        return ResponseEntity.ok(
                "Credential updated successfully"
        );

    }

    public DashboardStatsResponse getDashboardStats(User user) {

    List<Credential> credentials =
            credentialRepository.findByUserId(user.getId());

    int strongPasswords = 0;
    int weakPasswords = 0;

    Set<String> categories = new HashSet<>();

    for (Credential credential : credentials) {

        if (credential.getCategory() != null &&
                !credential.getCategory().isBlank()) {

            categories.add(credential.getCategory());
        }

        String password = encryptionService.decrypt(
                credential.getPassword()
        );

        if (password.length() >= 8 &&
                password.matches(".*[A-Z].*") &&
                password.matches(".*[a-z].*") &&
                password.matches(".*\\d.*") &&
                password.matches(".*[@$!%*?&#].*")) {

            strongPasswords++;

        } else {

            weakPasswords++;
        }
    }

    return new DashboardStatsResponse(
            credentials.size(),
            categories.size(),
            strongPasswords,
            weakPasswords
    );
}

}