package com.passwordvault.backend.dto;

import com.passwordvault.backend.entity.AccessLevel;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShareCredentialRequest {

    @NotNull
    private Long credentialId;

    @Email
    private String email;

    @NotNull
    private AccessLevel accessLevel;
}