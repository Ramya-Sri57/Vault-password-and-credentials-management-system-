package com.passwordvault.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class MailConfig {

    @Bean
    public JavaMailSender javaMailSender() {

        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);

        mailSender.setUsername(System.getenv("MAIL_USERNAME"));
        mailSender.setPassword(System.getenv("MAIL_PASSWORD"));

        mailSender.getJavaMailProperties().put(
                "mail.smtp.auth",
                "true"
        );

        mailSender.getJavaMailProperties().put(
                "mail.smtp.starttls.enable",
                "true"
        );

        return mailSender;
    }
}