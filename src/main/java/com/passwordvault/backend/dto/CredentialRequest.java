package com.passwordvault.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CredentialRequest {

    private String website;

    private String username;

    private String password;

    private String notes;

}