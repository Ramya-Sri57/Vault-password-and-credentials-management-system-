package com.passwordvault.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "shared_credentials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SharedCredential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Credential being shared
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "credential_id", nullable = false)
    private Credential credential;

    // Original owner
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    // User receiving access
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shared_with_id", nullable = false)
    private User sharedWith;

    // Sharing timestamp
    private LocalDateTime sharedAt;

    // Access permission
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AccessLevel accessLevel = AccessLevel.VIEW;
}