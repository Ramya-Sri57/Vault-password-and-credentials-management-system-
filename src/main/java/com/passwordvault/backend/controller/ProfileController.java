package com.passwordvault.backend.controller;

import com.passwordvault.backend.dto.ChangePasswordRequest;
import com.passwordvault.backend.dto.ProfileResponse;
import com.passwordvault.backend.dto.UpdateProfileRequest;
import com.passwordvault.backend.entity.User;
import com.passwordvault.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    private final ProfileService profileService;
    
    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                profileService.getProfile(user.getEmail())
        );
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                profileService.updateProfile(user.getEmail(), request)
        );
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequest request) {

        User user = (User) authentication.getPrincipal();

        profileService.changePassword(user.getEmail(), request);

        return ResponseEntity.ok("Password changed successfully");
    }
}