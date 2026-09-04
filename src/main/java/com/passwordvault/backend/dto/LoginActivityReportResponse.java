package com.passwordvault.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class LoginActivityReportResponse {

    private long totalAttempts;
    private long successfulLogins;
    private long failedLogins;
    private List<RecentLoginActivityResponse> recentActivities;
}