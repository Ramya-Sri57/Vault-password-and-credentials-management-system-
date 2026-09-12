package com.passwordvault.backend.service;

import com.passwordvault.backend.entity.PasswordResetOtp;
import com.passwordvault.backend.repository.PasswordResetOtpRepository;
import com.passwordvault.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.passwordvault.backend.exception.BadRequestException;
import com.passwordvault.backend.exception.ResourceNotFoundException;
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
    throw new ResourceNotFoundException("No account found with this email.");
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
System.out.println("========== BEFORE SENDING OTP EMAIL ==========");

emailService.sendOtpEmail(email, otp);

System.out.println("========== AFTER SENDING OTP EMAIL ==========");
    }
    public void verifyOtp(String email, String otp) {

    PasswordResetOtp resetOtp = otpRepository.findByEmail(email)
        .orElseThrow(() -> new BadRequestException("OTP not found or verification is required."));
   if (resetOtp.isVerified()) {
    throw new BadRequestException("OTP has already been used.");
}

   if (resetOtp.getExpiryTime().isBefore(LocalDateTime.now())) {
    throw new BadRequestException("OTP has expired. Please request a new OTP.");
}

    if (!resetOtp.getOtp().equals(otp)) {
    throw new BadRequestException("Invalid OTP.");
}

    resetOtp.setVerified(true);

    otpRepository.save(resetOtp);
}
@Transactional
public void resetPassword(String email, String newPassword) {

   PasswordResetOtp resetOtp = otpRepository.findByEmail(email)
        .orElseThrow(() -> new BadRequestException("OTP verification is required."));
   if (!resetOtp.isVerified()) {
    throw new BadRequestException("Please verify the OTP first.");
}

    if (resetOtp.getExpiryTime().isBefore(LocalDateTime.now())) {
    throw new BadRequestException("OTP has expired. Please request a new OTP.");
}

    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User account not found."));
    user.setPassword(passwordEncoder.encode(newPassword));

    userRepository.save(user);

    // OTP can no longer be reused
    otpRepository.deleteByEmail(email);
}
}