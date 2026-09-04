package com.passwordvault.backend.service;
import java.util.List;
import com.passwordvault.backend.entity.LoginActivity;
import com.passwordvault.backend.entity.User;
import com.passwordvault.backend.repository.LoginActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.passwordvault.backend.dto.LoginActivityReportResponse;
import java.time.LocalDateTime;
import com.passwordvault.backend.dto.RecentLoginActivityResponse;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class LoginActivityService {

    private final LoginActivityRepository loginActivityRepository;
    private final SecurityAlertService securityAlertService;
    private final AuditLogService auditLogService;
    // Record login activity
public void recordLogin(
        User user,
        String email,
        String status
) {
    LoginActivity activity = new LoginActivity();

    activity.setUser(user);
    activity.setEmail(email);
    activity.setStatus(status);
    activity.setLoginTime(LocalDateTime.now());

    loginActivityRepository.save(activity);
    auditLogService.log(
        user,
        email,
        "LOGIN",
        "Login attempt recorded with status: " + status
);

    // Check for suspicious activity after a failed login
    if ("FAILED".equals(status)) {

    boolean suspicious = isSuspicious(email);

    System.out.println(
            "Suspicious check for " + email + ": " + suspicious
    );

    if (suspicious) {

    System.out.println(
            "SUSPICIOUS ACTIVITY DETECTED for " + email
    );

    securityAlertService.createAlert(user, email);

    auditLogService.log(
            user,
            email,
            "SUSPICIOUS_ACTIVITY",
            "Multiple failed login attempts detected."
    );
}
}
}

    // Check whether login activity is suspicious
    public boolean isSuspicious(String email) {

        LocalDateTime fiveMinutesAgo =
                LocalDateTime.now().minusMinutes(5);

        long failedAttempts =
                loginActivityRepository
                        .countByEmailAndStatusAndLoginTimeAfter(
                                email,
                                "FAILED",
                                fiveMinutesAgo
                        );

        return failedAttempts >= 3;
    }
    public LoginActivityReportResponse getLoginActivityReport(User user) {

    List<LoginActivity> activities =
            loginActivityRepository.findByUser(user);

    long totalAttempts = activities.size();

    long successfulLogins = activities.stream()
            .filter(activity ->
                    "SUCCESS".equals(activity.getStatus()))
            .count();

    long failedLogins = activities.stream()
            .filter(activity ->
                    "FAILED".equals(activity.getStatus()))
            .count();

    List<RecentLoginActivityResponse> recentActivities =
            loginActivityRepository
                    .findByUserOrderByLoginTimeDesc(user)
                    .stream()
                    .limit(5)
                    .map(activity ->
                            new RecentLoginActivityResponse(
                                    activity.getStatus(),
                                    activity.getLoginTime()
                            )
                    )
                    .collect(Collectors.toList());

    return new LoginActivityReportResponse(
            totalAttempts,
            successfulLogins,
            failedLogins,
            recentActivities
    );
}
}