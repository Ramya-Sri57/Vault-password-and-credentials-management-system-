package com.passwordvault.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CredentialRequest {

    @NotBlank(message = "Website is required.")
    private String website;

    @NotBlank(message = "Username is required.")
    private String username;

    @NotBlank(message = "Password is required.")
    @Size(min = 1, message = "Password is required.")
    private String password;

    private String notes;

    private String category;

    private LocalDate expiryDate;
}