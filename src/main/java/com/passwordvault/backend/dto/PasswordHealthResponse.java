package com.passwordvault.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PasswordHealthResponse {

    private long totalPasswords;
    private long strongPasswords;
    private long mediumPasswords;
    private long weakPasswords;
    private double healthPercentage;
}