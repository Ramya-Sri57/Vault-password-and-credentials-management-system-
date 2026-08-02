package com.passwordvault.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Password Vault - Password Reset OTP");

        message.setText(
                "Hello,\n\n"
                        + "Your Password Vault password reset OTP is: "
                        + otp
                        + "\n\n"
                        + "This OTP is valid for 5 minutes.\n\n"
                        + "If you did not request a password reset, "
                        + "please ignore this email.\n\n"
                        + "Regards,\n"
                        + "Password Vault Team"
        );

        mailSender.send(message);
    }
}