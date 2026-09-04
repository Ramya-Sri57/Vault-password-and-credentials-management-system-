package com.passwordvault.backend.controller;

import com.passwordvault.backend.dto.SecurityAnalyticsResponse;
import com.passwordvault.backend.entity.User;
import com.passwordvault.backend.service.SecurityAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/security")
@RequiredArgsConstructor
public class SecurityAnalyticsController {

    private final SecurityAnalyticsService securityAnalyticsService;

    @GetMapping("/analytics")
    public SecurityAnalyticsResponse getAnalytics(
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return securityAnalyticsService.getAnalytics(user);
    }
}