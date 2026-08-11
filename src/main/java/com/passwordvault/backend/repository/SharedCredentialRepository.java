package com.passwordvault.backend.repository;

import com.passwordvault.backend.entity.Credential;
import com.passwordvault.backend.entity.SharedCredential;
import com.passwordvault.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SharedCredentialRepository
        extends JpaRepository<SharedCredential, Long> {

    // All credentials shared with a user
    List<SharedCredential> findBySharedWith(User sharedWith);

    // All credentials shared by an owner
    List<SharedCredential> findByOwner(User owner);

    // Prevent duplicate sharing
    Optional<SharedCredential> findByCredentialAndSharedWith(
            Credential credential,
            User sharedWith
    );

    // Get all users a credential is shared with
    List<SharedCredential> findByCredential(Credential credential);

}