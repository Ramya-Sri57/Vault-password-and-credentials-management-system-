package com.passwordvault.backend.service;

import okhttp3.*;

import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailService {

    private final OkHttpClient client = new OkHttpClient();

    public void sendOtpEmail(String toEmail, String otp) {

        String apiKey = System.getenv("RESEND_API_KEY");

        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException("RESEND_API_KEY is not configured.");
        }

        String json = """
                {
                  "from": "onboarding@resend.dev",
                  "to": ["%s"],
                  "subject": "Password Vault - Password Reset OTP",
                  "text": "Hello,\\n\\nYour Password Vault password reset OTP is: %s\\n\\nThis OTP is valid for 5 minutes.\\n\\nIf you did not request a password reset, please ignore this email.\\n\\nRegards,\\nPassword Vault Team"
                }
                """.formatted(toEmail, otp);

        RequestBody body = RequestBody.create(
                json,
                MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
                .url("https://api.resend.com/emails")
                .post(body)
                .addHeader("Authorization", "Bearer " + apiKey)
                .addHeader("Content-Type", "application/json")
                .build();

        try (Response response = client.newCall(request).execute()) {

            if (!response.isSuccessful()) {
                String errorBody =
                        response.body() != null
                                ? response.body().string()
                                : "No response body";

                throw new RuntimeException(
                        "Resend email failed: " + errorBody
                );
            }

            System.out.println(
                    "========== OTP EMAIL SENT SUCCESSFULLY =========="
            );

        } catch (IOException e) {
            throw new RuntimeException(
                    "Unable to connect to Resend email service.",
                    e
            );
        }
    }
}