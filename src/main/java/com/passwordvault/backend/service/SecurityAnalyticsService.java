package com.passwordvault.backend.service;

import com.passwordvault.backend.dto.SecurityAnalyticsResponse;
import com.passwordvault.backend.entity.User;
import com.passwordvault.backend.repository.AuditLogRepository;
import com.passwordvault.backend.repository.LoginActivityRepository;
import com.passwordvault.backend.repository.SecurityAlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SecurityAnalyticsService {

    private final LoginActivityRepository loginActivityRepository;
    private final SecurityAlertRepository securityAlertRepository;
    private final AuditLogRepository auditLogRepository;

    public SecurityAnalyticsResponse getAnalytics(User user) {

        long totalLoginAttempts =
                loginActivityRepository.findByUser(user).size();

        long successfulLogins =
                loginActivityRepository
                        .findByUser(user)
                        .stream()
                        .filter(activity ->
                                "SUCCESS".equals(activity.getStatus()))
                        .count();

        long failedLogins =
                loginActivityRepository
                        .findByUser(user)
                        .stream()
                        .filter(activity ->
                                "FAILED".equals(activity.getStatus()))
                        .count();

        long suspiciousActivities =
                auditLogRepository
                        .findByUser(user)
                        .stream()
                        .filter(log ->
                                "SUSPICIOUS_ACTIVITY"
                                        .equals(log.getAction()))
                        .count();

        long securityAlerts =
                securityAlertRepository
                        .findByUser(user)
                        .size();

        long auditActivities =
                auditLogRepository
                        .findByUser(user)
                        .size();

        return new SecurityAnalyticsResponse(
                totalLoginAttempts,
                successfulLogins,
                failedLogins,
                suspiciousActivities,
                securityAlerts,
                auditActivities
        );
    }
}