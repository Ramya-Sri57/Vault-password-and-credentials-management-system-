package com.passwordvault.backend.controller;

import com.passwordvault.backend.dto.AuthResponse;
import com.passwordvault.backend.dto.LoginRequest;
import com.passwordvault.backend.dto.RegisterRequest;
import com.passwordvault.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.passwordvault.backend.dto.ForgotPasswordRequest;
import com.passwordvault.backend.service.PasswordResetService;
import com.passwordvault.backend.dto.VerifyOtpRequest;
import com.passwordvault.backend.dto.ResetPasswordRequest;
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

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

@PostMapping("/forgot-password")
public String forgotPassword(
        @Valid @RequestBody ForgotPasswordRequest request) {

    passwordResetService.generateAndSendOtp(request.getEmail());

    return "OTP sent successfully";
}
@PostMapping("/verify-otp")
public String verifyOtp(
        @Valid @RequestBody VerifyOtpRequest request) {

    passwordResetService.verifyOtp(
            request.getEmail(),
            request.getOtp()
    );

    return "OTP verified successfully";
}
@PostMapping("/reset-password")
public String resetPassword(
        @Valid @RequestBody ResetPasswordRequest request) {

    passwordResetService.resetPassword(
            request.getEmail(),
            request.getNewPassword()
    );

    return "Password reset successful";
}
}