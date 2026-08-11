package com.passwordvault.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DashboardStatsResponse {

    private long totalPasswords;
    private long totalCategories;
    private long strongPasswords;
    private long weakPasswords;

}