package com.passwordvault.backend.dto;

import com.passwordvault.backend.entity.AccessLevel;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.Positive;
@Getter
@Setter
public class ShareCredentialRequest {

    @NotNull(message = "Credential ID is required.")
@Positive(message = "Credential ID must be a positive number.")
private Long credentialId;

    @NotBlank(message = "Recipient email is required.")
    @Email(message = "Please enter a valid recipient email address.")
    private String email;

    @NotNull(message = "Access level is required.")
    private AccessLevel accessLevel;
}