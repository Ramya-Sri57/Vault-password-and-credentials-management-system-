package com.passwordvault.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
@Getter
@Setter
public class CredentialRequest {

    private String website;

    private String username;

    private String password;

    private String notes;

    private String category;
    private LocalDate expiryDate;
}