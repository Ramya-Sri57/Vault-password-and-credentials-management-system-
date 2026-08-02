package com.passwordvault.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "credentials")
public class Credential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String website;

    private String username;

    private String password;

    private String notes;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}