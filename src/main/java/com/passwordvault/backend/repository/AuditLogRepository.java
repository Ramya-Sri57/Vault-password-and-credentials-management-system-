package com.passwordvault.backend.repository;

import com.passwordvault.backend.entity.AuditLog;
import com.passwordvault.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByUser(User user);

    List<AuditLog> findByEmail(String email);

    List<AuditLog> findAllByOrderByTimestampDesc();
}