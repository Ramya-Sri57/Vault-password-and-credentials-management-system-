package com.passwordvault.backend.controller;

import com.passwordvault.backend.dto.ShareCredentialRequest;
import com.passwordvault.backend.entity.User;
import com.passwordvault.backend.service.SharedCredentialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.passwordvault.backend.entity.SharedCredential;
import com.passwordvault.backend.dto.SharedCredentialResponse;
@RestController
@RequestMapping("/api/share")
@RequiredArgsConstructor
public class SharedCredentialController {

    private final SharedCredentialService sharedCredentialService;
@PostMapping
public String shareCredential(
        @Valid @RequestBody ShareCredentialRequest request,
        Authentication authentication
) {

    System.out.println("========== SHARE API CALLED ==========");

    User owner = (User) authentication.getPrincipal();

    sharedCredentialService.shareCredential(request, owner);

    return "Credential shared successfully.";
}
   @GetMapping("/shared-with-me")
public List<SharedCredentialResponse> getSharedWithMe(
        Authentication authentication
) {

    User user = (User) authentication.getPrincipal();

    return sharedCredentialService.getSharedWithMe(user);

}

@GetMapping("/shared-by-me")
public List<SharedCredentialResponse> getSharedByMe(
        Authentication authentication
) {

    User user = (User) authentication.getPrincipal();

    return sharedCredentialService.getSharedByMe(user);

}

@DeleteMapping("/{shareId}")
public String revokeAccess(
        @PathVariable Long shareId,
        Authentication authentication
) {

    User owner = (User) authentication.getPrincipal();

    sharedCredentialService.revokeAccess(
            shareId,
            owner
    );

    return "Credential sharing access revoked successfully.";
}

@GetMapping("/{credentialId}/users")
public List<SharedCredentialResponse> getUsersWithAccess(
        @PathVariable Long credentialId,
        Authentication authentication
) {

    User user = (User) authentication.getPrincipal();

    return sharedCredentialService.getUsersWithAccess(
            credentialId,
            user
    );
}
}