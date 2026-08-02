package com.passwordvault.backend.controller;

import com.passwordvault.backend.entity.Credential;
import com.passwordvault.backend.entity.User;
import com.passwordvault.backend.service.CredentialService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/credentials")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CredentialController {

    private final CredentialService credentialService;

    @PostMapping
    public Credential saveCredential(
            Authentication authentication,
            @RequestBody Credential credential
    ) {

        User user = (User) authentication.getPrincipal();

        return credentialService.save(credential, user);

    }

    @GetMapping
    public List<Credential> getCredentials(
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        return credentialService.getAll(user);

    }
    @GetMapping("/{id}")
public ResponseEntity<?> getCredentialById(
        @PathVariable Long id,
        Authentication authentication
) {

    User user = (User) authentication.getPrincipal();

    return credentialService.getById(id, user);

}

    @DeleteMapping("/{id}")
    public void deleteCredential(@PathVariable Long id) {

        credentialService.delete(id);

    }
    @PutMapping("/{id}")
public ResponseEntity<?> updateCredential(
        @PathVariable Long id,
        @RequestBody Credential credential,
        Authentication authentication
) {

    User user = (User) authentication.getPrincipal();

    return credentialService.updateCredential(id, credential, user);

}

}