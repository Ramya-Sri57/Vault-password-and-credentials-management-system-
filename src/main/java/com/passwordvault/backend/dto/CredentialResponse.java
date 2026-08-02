package com.passwordvault.backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CredentialResponse {

    private Long id;

    private String website;

    private String username;

    private String password;

    private String notes;

}