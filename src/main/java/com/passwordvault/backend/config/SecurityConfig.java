package com.passwordvault.backend.config;

import com.passwordvault.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfigurationSource;


@Configuration
@RequiredArgsConstructor
public class SecurityConfig {


    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final CorsConfigurationSource corsConfigurationSource;



    @Bean
    PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();

    }



    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {


        http
            .cors(cors -> 
                cors.configurationSource(corsConfigurationSource)
            )

            .csrf(csrf -> csrf.disable())


            .authorizeHttpRequests(auth -> auth


                // Allow browser CORS preflight
                .requestMatchers(
                    org.springframework.web.cors.CorsUtils::isPreFlightRequest
                )
                .permitAll()


                // Public authentication APIs
                .requestMatchers("/api/auth/**")
                .permitAll()


                // Protected APIs
                .anyRequest()
                .authenticated()

            )


            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            );


        http.addFilterBefore(
            jwtAuthenticationFilter,
            UsernamePasswordAuthenticationFilter.class
        );


        return http.build();
    }

}