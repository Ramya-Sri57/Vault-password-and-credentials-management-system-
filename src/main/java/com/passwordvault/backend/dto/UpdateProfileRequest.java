package com.passwordvault.backend.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {

    private String fullName;

    private String email;

}