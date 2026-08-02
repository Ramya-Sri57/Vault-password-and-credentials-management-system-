package com.passwordvault.backend.service;

import com.passwordvault.backend.entity.Credential;
import com.passwordvault.backend.entity.User;
import com.passwordvault.backend.repository.CredentialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CredentialService {

    private final CredentialRepository credentialRepository;

    public Credential save(Credential credential, User user) {

        credential.setUser(user);

        return credentialRepository.save(credential);

    }

    public List<Credential> getAll(User user) {

        return credentialRepository.findByUser(user);

    }
    public ResponseEntity<?> getById(Long id, User user) {

    Optional<Credential> credential =
            credentialRepository.findById(id);


    if(credential.isPresent() &&
       credential.get().getUser().getId().equals(user.getId())) {

        return ResponseEntity.ok(credential.get());

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


    Credential credential = existingCredential.get();


    if(!credential.getUser().getId().equals(user.getId())) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("Not allowed");

    }


    credential.setWebsite(updatedCredential.getWebsite());
    credential.setUsername(updatedCredential.getUsername());
    credential.setPassword(updatedCredential.getPassword());
    credential.setNotes(updatedCredential.getNotes());


    credentialRepository.save(credential);


    return ResponseEntity.ok("Credential updated successfully");

}

}
