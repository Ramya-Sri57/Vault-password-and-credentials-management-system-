package com.passwordvault.backend.controller;
import com.passwordvault.backend.dto.DashboardStatsResponse;
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
import com.passwordvault.backend.dto.CredentialRequest;
import jakarta.validation.Valid;
@RestController
@RequestMapping("/api/credentials")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CredentialController {

    private final CredentialService credentialService;

   @PostMapping
public Credential saveCredential(
        Authentication authentication,
        @Valid @RequestBody CredentialRequest request
) {

    User user = (User) authentication.getPrincipal();

    Credential credential = new Credential();

    credential.setWebsite(request.getWebsite());
    credential.setUsername(request.getUsername());
    credential.setPassword(request.getPassword());
    credential.setNotes(request.getNotes());
    credential.setCategory(request.getCategory());
    credential.setExpiryDate(request.getExpiryDate());

    return credentialService.save(credential, user);
}

    @GetMapping
    public List<Credential> getCredentials(
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        return credentialService.getAll(user);

    }

        @GetMapping("/dashboard-stats")
    public DashboardStatsResponse getDashboardStats(
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        return credentialService.getDashboardStats(user);
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
public ResponseEntity<?> deleteCredential(
        @PathVariable Long id,
        Authentication authentication
) {

    User user = (User) authentication.getPrincipal();

    return credentialService.delete(id, user);

}
   @PutMapping("/{id}")
public ResponseEntity<?> updateCredential(
        @PathVariable Long id,
        @Valid @RequestBody CredentialRequest request,
        Authentication authentication
) {

    User user = (User) authentication.getPrincipal();

    Credential credential = new Credential();

    credential.setWebsite(request.getWebsite());
    credential.setUsername(request.getUsername());
    credential.setPassword(request.getPassword());
    credential.setNotes(request.getNotes());
    credential.setCategory(request.getCategory());
    credential.setExpiryDate(request.getExpiryDate());

    return credentialService.updateCredential(id, credential, user);
}

}