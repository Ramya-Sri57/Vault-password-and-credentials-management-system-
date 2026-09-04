package com.passwordvault.backend.controller;

import com.passwordvault.backend.dto.PasswordHealthResponse;
import com.passwordvault.backend.entity.User;
import com.passwordvault.backend.service.CredentialService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/security")
@RequiredArgsConstructor
public class PasswordHealthController {

    private final CredentialService credentialService;

    @GetMapping("/password-health")
    public PasswordHealthResponse getPasswordHealth(
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        return credentialService.getPasswordHealth(user);
    }
}