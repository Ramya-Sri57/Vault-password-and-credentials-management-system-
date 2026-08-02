package com.passwordvault.backend.service;

import com.passwordvault.backend.dto.ChangePasswordRequest;
import com.passwordvault.backend.dto.ProfileResponse;
import com.passwordvault.backend.dto.UpdateProfileRequest;

public interface ProfileService {

    ProfileResponse getProfile(String email);

    ProfileResponse updateProfile(String email, UpdateProfileRequest request);

    void changePassword(String email, ChangePasswordRequest request);

}