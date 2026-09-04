package com.passwordvault.backend.repository;

import com.passwordvault.backend.entity.SecurityAlert;
import com.passwordvault.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface SecurityAlertRepository
        extends JpaRepository<SecurityAlert, Long> {

    List<SecurityAlert> findByUser(User user);

    List<SecurityAlert> findByEmail(String email);

    List<SecurityAlert> findByResolved(boolean resolved);

Optional<SecurityAlert> findByEmailAndAlertTypeAndResolved(
        String email,
        String alertType,
        boolean resolved
);
}