package com.passwordvault.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class SharedCredentialResponse {

    private Long shareId;

    private Long credentialId;

    private String website;

    private String username;

    private String password;

    private String notes;

    private String sharedBy;

    private String sharedWith;

    private LocalDateTime sharedAt;

}