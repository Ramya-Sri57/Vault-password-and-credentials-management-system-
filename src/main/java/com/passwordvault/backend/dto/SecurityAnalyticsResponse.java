package com.passwordvault.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SecurityAnalyticsResponse {

    private long totalLoginAttempts;
    private long successfulLogins;
    private long failedLogins;
    private long suspiciousActivities;
    private long securityAlerts;
    private long auditActivities;
}