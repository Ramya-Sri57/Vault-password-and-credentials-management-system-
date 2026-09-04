package com.passwordvault.backend.controller;

import com.passwordvault.backend.dto.LoginActivityReportResponse;
import com.passwordvault.backend.entity.User;
import com.passwordvault.backend.service.LoginActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/security")
@RequiredArgsConstructor
public class LoginActivityReportController {

    private final LoginActivityService loginActivityService;

    @GetMapping("/login-activity-report")
    public LoginActivityReportResponse getLoginActivityReport(
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        return loginActivityService.getLoginActivityReport(user);
    }
}