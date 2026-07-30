package com.passwordvault.backend.controller;

import com.passwordvault.backend.dto.AuthResponse;
import com.passwordvault.backend.dto.LoginRequest;
import com.passwordvault.backend.dto.RegisterRequest;
import com.passwordvault.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // Register API
    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {

        System.out.println("========== REGISTER API CALLED ==========");

        return authService.register(request);
    }

    // Login API
    @PostMapping("/login")
public AuthResponse login(@Valid @RequestBody LoginRequest request) {

    System.out.println("========== LOGIN API CALLED ==========");

    return authService.login(request);
}
}