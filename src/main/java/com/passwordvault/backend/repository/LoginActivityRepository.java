package com.passwordvault.backend.repository;

import com.passwordvault.backend.entity.LoginActivity;
import com.passwordvault.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface LoginActivityRepository extends JpaRepository<LoginActivity, Long> {

    List<LoginActivity> findByUser(User user);

    List<LoginActivity> findByEmail(String email);

    List<LoginActivity> findByStatus(String status);
    List<LoginActivity> findByUserOrderByLoginTimeDesc(User user);
long countByEmailAndStatusAndLoginTimeAfter(
        String email,
        String status,
        LocalDateTime time
);

}