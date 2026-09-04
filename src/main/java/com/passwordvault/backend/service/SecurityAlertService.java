package com.passwordvault.backend.service;

import com.passwordvault.backend.entity.SecurityAlert;
import com.passwordvault.backend.entity.User;
import com.passwordvault.backend.repository.SecurityAlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SecurityAlertService {

    private final SecurityAlertRepository securityAlertRepository;

    public void createAlert(User user, String email) {

    boolean alertAlreadyExists =
            securityAlertRepository
                    .findByEmailAndAlertTypeAndResolved(
                            email,
                            "MULTIPLE_FAILED_LOGINS",
                            false
                    )
                    .isPresent();

    if (alertAlreadyExists) {
        return;
    }

    SecurityAlert alert = new SecurityAlert();

    alert.setUser(user);
    alert.setEmail(email);
    alert.setAlertType("MULTIPLE_FAILED_LOGINS");
    alert.setMessage("Multiple failed login attempts detected.");
    alert.setAlertTime(LocalDateTime.now());
    alert.setResolved(false);

    securityAlertRepository.save(alert);
}
}