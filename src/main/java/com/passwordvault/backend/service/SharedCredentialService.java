package com.passwordvault.backend.service;

import com.passwordvault.backend.dto.ShareCredentialRequest;
import com.passwordvault.backend.entity.Credential;
import com.passwordvault.backend.entity.SharedCredential;
import com.passwordvault.backend.entity.User;
import com.passwordvault.backend.repository.CredentialRepository;
import com.passwordvault.backend.repository.SharedCredentialRepository;
import com.passwordvault.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.passwordvault.backend.dto.SharedCredentialResponse;
import java.util.stream.Collectors;
import java.util.List;
import com.passwordvault.backend.security.EncryptionService;
@Service
@RequiredArgsConstructor
public class SharedCredentialService {
private final SharedCredentialRepository sharedCredentialRepository;
private final CredentialRepository credentialRepository;
private final UserRepository userRepository;
private final EncryptionService encryptionService;
public void shareCredential(
        ShareCredentialRequest request,
        User owner
) {

    // Find the credential
    Credential credential = credentialRepository
            .findById(request.getCredentialId())
            .orElseThrow(() ->
                    new RuntimeException("Credential not found.")
            );

    // Verify ownership
    if (!credential.getUser().getId().equals(owner.getId())) {
        throw new RuntimeException(
                "You can only share your own credentials."
        );
    }

    // Find recipient by email
    User recipient = userRepository
            .findByEmail(request.getEmail())
            .orElseThrow(() ->
                    new RuntimeException("User not found.")
            );

    // Prevent sharing with yourself
    if (recipient.getId().equals(owner.getId())) {
        throw new RuntimeException(
                "You cannot share with yourself."
        );
    }

    // Prevent duplicate sharing
    if (sharedCredentialRepository
            .findByCredentialAndSharedWith(
                    credential,
                    recipient
            )
            .isPresent()) {

        throw new RuntimeException(
                "Credential already shared with this user."
        );
    }

    // Save sharing
    SharedCredential sharedCredential =
            SharedCredential.builder()
                    .credential(credential)
                    .owner(owner)
                    .sharedWith(recipient)
                    .sharedAt(java.time.LocalDateTime.now())
                    .build();

    sharedCredentialRepository.save(sharedCredential);
}

public List<SharedCredentialResponse> getSharedWithMe(User user) {

    return sharedCredentialRepository.findBySharedWith(user)
            .stream()
            .map(shared -> SharedCredentialResponse.builder()
                    .shareId(shared.getId())
                    .credentialId(shared.getCredential().getId())
                    .website(shared.getCredential().getWebsite())
                    .username(shared.getCredential().getUsername())
                   .password(
    encryptionService.decrypt(
        shared.getCredential().getPassword()
    )
)
                    .notes(shared.getCredential().getNotes())
                    .sharedBy(shared.getOwner().getEmail())
                    .sharedWith(shared.getSharedWith().getEmail())
                    .sharedAt(shared.getSharedAt())
                    .build())
            .collect(Collectors.toList());

}

public List<SharedCredentialResponse> getSharedByMe(User user) {

    return sharedCredentialRepository.findByOwner(user)
            .stream()
            .map(shared -> SharedCredentialResponse.builder()
                    .shareId(shared.getId())
                    .credentialId(shared.getCredential().getId())
                    .website(shared.getCredential().getWebsite())
                    .username(shared.getCredential().getUsername())
                    .password(
    encryptionService.decrypt(
        shared.getCredential().getPassword()
    )
)
                    .notes(shared.getCredential().getNotes())
                    .sharedBy(shared.getOwner().getEmail())
                    .sharedWith(shared.getSharedWith().getEmail())
                    .sharedAt(shared.getSharedAt())
                    .build())
            .toList();

}

public void revokeAccess(Long shareId, User owner) {

    SharedCredential sharedCredential =
            sharedCredentialRepository
                    .findById(shareId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Shared credential not found."
                            )
                    );

    // Only the owner can revoke access
    if (!sharedCredential.getOwner().getId().equals(owner.getId())) {

        throw new RuntimeException(
                "You can only revoke access to credentials you shared."
        );

    }

    sharedCredentialRepository.delete(sharedCredential);
}
}