package com.passwordvault.backend.service;

import com.passwordvault.backend.dto.AuthResponse;
import com.passwordvault.backend.dto.LoginRequest;
import com.passwordvault.backend.dto.RegisterRequest;
import com.passwordvault.backend.entity.User;
import com.passwordvault.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.passwordvault.backend.security.JwtService;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final LoginActivityService loginActivityService;

    // Register
    public AuthResponse register(RegisterRequest request) {

        Optional<User> existingUser =
                userRepository.findByEmail(request.getEmail());

        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        String encryptedPassword =
                passwordEncoder.encode(request.getPassword());

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(encryptedPassword);
        user.setRole("USER");

        userRepository.save(user);

        return new AuthResponse(
                "User Registered Successfully",
                null
        );
    }

    // Login
    public AuthResponse login(LoginRequest request) {

        Optional<User> userOptional =
                userRepository.findByEmail(request.getEmail());

        // User does not exist
        if (userOptional.isEmpty()) {

            loginActivityService.recordLogin(
                    null,
                    request.getEmail(),
                    "FAILED"
            );

            throw new RuntimeException("User not found");
        }

        User user = userOptional.get();

        // Password is incorrect
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {

            loginActivityService.recordLogin(
                    user,
                    request.getEmail(),
                    "FAILED"
            );

            throw new RuntimeException("Invalid Password");
        }

        // Password is correct
        loginActivityService.recordLogin(
                user,
                request.getEmail(),
                "SUCCESS"
        );

        // Generate JWT
        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                "Login Successful",
                token
        );
    }
}