package com.passwordvault.backend.service;

import com.passwordvault.backend.entity.AuditLog;
import com.passwordvault.backend.entity.User;
import com.passwordvault.backend.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void log(
            User user,
            String email,
            String action,
            String description
    ) {

        AuditLog auditLog = new AuditLog();

        auditLog.setUser(user);
        auditLog.setEmail(email);
        auditLog.setAction(action);
        auditLog.setDescription(description);
        auditLog.setTimestamp(LocalDateTime.now());

        auditLogRepository.save(auditLog);
    }
}