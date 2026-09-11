package com.passwordvault.backend.service;
import com.passwordvault.backend.entity.AccessLevel;
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
import com.passwordvault.backend.exception.BadRequestException;
import com.passwordvault.backend.exception.ConflictException;
import com.passwordvault.backend.exception.ResourceNotFoundException;
import com.passwordvault.backend.exception.UnauthorizedException;
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
        new ResourceNotFoundException("Credential not found.")
);

    // Owner always has permission to manage sharing
boolean isOwner =
        credential.getUser().getId().equals(owner.getId());

if (!isOwner) {

    // Check whether this user has access to the credential
    SharedCredential existingAccess =
            sharedCredentialRepository
                    .findByCredentialAndSharedWith(
                            credential,
                            owner
                    )
                    .orElse(null);

    // Only FULL_ACCESS can manage sharing
    if (existingAccess == null ||
            existingAccess.getAccessLevel() != AccessLevel.FULL_ACCESS) {

       throw new UnauthorizedException(
        "You do not have permission to manage sharing for this credential."
);
    }
}

    // Find recipient by email
   User recipient = userRepository
        .findByEmail(request.getEmail())
        .orElseThrow(() ->
                new ResourceNotFoundException(
                        "Recipient user not found."
                )
        );

    // Prevent sharing with yourself
    if (recipient.getId().equals(owner.getId())) {
        throw new BadRequestException(
        "You cannot share a credential with yourself."
);
    }

    // Prevent duplicate sharing
    if (sharedCredentialRepository
            .findByCredentialAndSharedWith(
                    credential,
                    recipient
            )
            .isPresent()) {

        throw new ConflictException(
        "Credential is already shared with this user."
);
    }

    // Save sharing
SharedCredential sharedCredential =
        SharedCredential.builder()
                .credential(credential)
                .owner(owner)
                .sharedWith(recipient)
                .sharedAt(java.time.LocalDateTime.now())
                .accessLevel(request.getAccessLevel())
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
                    .accessLevel(shared.getAccessLevel())
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
                    .accessLevel(shared.getAccessLevel())
                    .build())
            .toList();

}

public List<SharedCredentialResponse> getUsersWithAccess(
        Long credentialId,
        User user
) {

    // Find the credential
    Credential credential = credentialRepository
            .findById(credentialId)
            .orElseThrow(() ->
                    new RuntimeException("Credential not found.")
            );

    // Check whether current user is the original owner
    boolean isOwner =
            credential.getUser().getId().equals(user.getId());

    // If not owner, check whether user has FULL_ACCESS
    if (!isOwner) {

        SharedCredential currentUserAccess =
                sharedCredentialRepository
                        .findByCredentialAndSharedWith(
                                credential,
                                user
                        )
                        .orElse(null);

        if (currentUserAccess == null ||
                currentUserAccess.getAccessLevel()
                        != AccessLevel.FULL_ACCESS) {

            throw new UnauthorizedException(
        "You do not have permission to manage sharing."
);
        }
    }

    // Get everyone this credential has been shared with
    return sharedCredentialRepository
            .findByCredential(credential)
            .stream()
            .map(shared ->
                    SharedCredentialResponse.builder()
                            .shareId(shared.getId())
                            .credentialId(credential.getId())
                            .website(credential.getWebsite())
                            .username(credential.getUsername())
                            .password(null)
                            .notes(credential.getNotes())
                            .sharedBy(shared.getOwner().getEmail())
                            .sharedWith(
                                    shared.getSharedWith().getEmail()
                            )
                            .sharedAt(shared.getSharedAt())
                            .accessLevel(
                                    shared.getAccessLevel()
                            )
                            .build()
            )
            .toList();
}
public void revokeAccess(Long shareId, User owner) {

    SharedCredential sharedCredential =
            sharedCredentialRepository
                    .findById(shareId)
                    .orElseThrow(() ->
        new ResourceNotFoundException(
                "Shared credential not found."
        )
);

   // Owner always has permission to revoke
boolean isOwner =
        sharedCredential.getOwner().getId().equals(owner.getId());

if (!isOwner) {

    // Check whether the current user has FULL_ACCESS
    SharedCredential currentUserAccess =
            sharedCredentialRepository
                    .findByCredentialAndSharedWith(
                            sharedCredential.getCredential(),
                            owner
                    )
                    .orElse(null);

    if (currentUserAccess == null ||
            currentUserAccess.getAccessLevel() != AccessLevel.FULL_ACCESS) {

        throw new RuntimeException(
                "You do not have permission to manage sharing for this credential."
        );
    }
}

    sharedCredentialRepository.delete(sharedCredential);
}

public void checkEditPermission(
        Long credentialId,
        User user
) {

    Credential credential = credentialRepository
            .findById(credentialId)
            .orElseThrow(() ->
                    new RuntimeException("Credential not found.")
            );

    // Owner can always edit
    if (credential.getUser().getId().equals(user.getId())) {
        return;
    }

    // Find recipient's access
    SharedCredential access =
            sharedCredentialRepository
                    .findByCredentialAndSharedWith(
                            credential,
                            user
                    )
                    .orElse(null);

    // EDIT and FULL_ACCESS can edit
    if (access == null ||
            (access.getAccessLevel() != AccessLevel.EDIT &&
             access.getAccessLevel() != AccessLevel.FULL_ACCESS)) {

       throw new UnauthorizedException(
        "You do not have permission to edit this credential."
);
    }
}
}