package com.passwordvault.backend.controller;

import com.passwordvault.backend.entity.AuditLog;
import com.passwordvault.backend.entity.LoginActivity;
import com.passwordvault.backend.entity.SecurityAlert;
import com.passwordvault.backend.entity.User;
import com.passwordvault.backend.repository.AuditLogRepository;
import com.passwordvault.backend.repository.LoginActivityRepository;
import com.passwordvault.backend.repository.SecurityAlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/security")
@RequiredArgsConstructor
public class SecurityMonitoringController {

    private final LoginActivityRepository loginActivityRepository;
    private final SecurityAlertRepository securityAlertRepository;
    private final AuditLogRepository auditLogRepository;

    @GetMapping("/login-activities")
    public List<LoginActivity> getLoginActivities(
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        return loginActivityRepository.findByUser(user);
    }

    @GetMapping("/alerts")
    public List<SecurityAlert> getSecurityAlerts(
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        return securityAlertRepository.findByUser(user);
    }

    @GetMapping("/audit-logs")
    public List<AuditLog> getAuditLogs(
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        return auditLogRepository.findByUser(user);
    }
}