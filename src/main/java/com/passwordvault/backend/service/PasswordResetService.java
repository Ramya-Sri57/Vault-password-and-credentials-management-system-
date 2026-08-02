package com.passwordvault.backend.service;

import com.passwordvault.backend.entity.PasswordResetOtp;
import com.passwordvault.backend.repository.PasswordResetOtpRepository;
import com.passwordvault.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.passwordvault.backend.entity.User;
@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetOtpRepository otpRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

   @Transactional
public void generateAndSendOtp(String email) {
        // Check whether the user exists
        boolean userExists = userRepository.findByEmail(email).isPresent();

        if (!userExists) {
            throw new RuntimeException("User not found");
        }

        // Remove any previous OTP for this email
        otpRepository.deleteByEmail(email);

        // Generate a 6-digit OTP
        String otp = String.valueOf(
                ThreadLocalRandom.current().nextInt(100000, 1000000)
        );

        // Create OTP record
        PasswordResetOtp passwordResetOtp = new PasswordResetOtp();

        passwordResetOtp.setEmail(email);
        passwordResetOtp.setOtp(otp);
        passwordResetOtp.setExpiryTime(
                LocalDateTime.now().plusMinutes(5)
        );
        passwordResetOtp.setVerified(false);

        // Save OTP in database
        otpRepository.save(passwordResetOtp);

        // Send OTP to user's email
        emailService.sendOtpEmail(email, otp);
    }
    public void verifyOtp(String email, String otp) {

    PasswordResetOtp resetOtp = otpRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("OTP not found"));

    if (resetOtp.isVerified()) {
        throw new RuntimeException("OTP already used");
    }

    if (resetOtp.getExpiryTime().isBefore(LocalDateTime.now())) {
        throw new RuntimeException("OTP expired");
    }

    if (!resetOtp.getOtp().equals(otp)) {
        throw new RuntimeException("Invalid OTP");
    }

    resetOtp.setVerified(true);

    otpRepository.save(resetOtp);
}
@Transactional
public void resetPassword(String email, String newPassword) {

    PasswordResetOtp resetOtp = otpRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("OTP verification required"));

    if (!resetOtp.isVerified()) {
        throw new RuntimeException("Please verify OTP first");
    }

    if (resetOtp.getExpiryTime().isBefore(LocalDateTime.now())) {
        throw new RuntimeException("OTP expired");
    }

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    user.setPassword(passwordEncoder.encode(newPassword));

    userRepository.save(user);

    // OTP can no longer be reused
    otpRepository.deleteByEmail(email);
}
}