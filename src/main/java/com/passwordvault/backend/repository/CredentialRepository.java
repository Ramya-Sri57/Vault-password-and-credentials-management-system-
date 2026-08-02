package com.passwordvault.backend.repository;

import com.passwordvault.backend.entity.Credential;
import com.passwordvault.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CredentialRepository extends JpaRepository<Credential, Long> {

    List<Credential> findByUserId(Long userId);
}