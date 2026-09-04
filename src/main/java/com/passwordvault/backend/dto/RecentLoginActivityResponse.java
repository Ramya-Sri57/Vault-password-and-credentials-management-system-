package com.passwordvault.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class RecentLoginActivityResponse {

    private String status;
    private LocalDateTime loginTime;
}