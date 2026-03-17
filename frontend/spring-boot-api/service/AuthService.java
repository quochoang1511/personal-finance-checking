package com.example.personalfinancechecking.service;

import com.example.personalfinancechecking.dto.AuthRequest;
import com.example.personalfinancechecking.dto.UserDTO;
import com.example.personalfinancechecking.entity.ApiResponse;
import com.example.personalfinancechecking.entity.User;
import com.example.personalfinancechecking.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Dang ky
    public ApiResponse register(AuthRequest.RegisterRequest request) {
        // Kiem tra email da ton tai chua
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return new ApiResponse(false, "Email already exists", null);
        }

        // Hash password
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .email(request.getEmail())
                .password(hashedPassword)
                .fullName(request.getFullName())
                .build();

        User saved = userRepository.save(user);
        
        UserDTO userDTO = new UserDTO(saved.getId(), saved.getEmail(), saved.getFullName());
        return new ApiResponse(true, "Registration successful", userDTO);
    }

    // Dang nhap
    public ApiResponse login(AuthRequest.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        
        if (user == null) {
            return new ApiResponse(false, "Invalid email or password", null);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new ApiResponse(false, "Invalid email or password", null);
        }

        UserDTO userDTO = new UserDTO(user.getId(), user.getEmail(), user.getFullName());
        // Trong thuc te, ban se tao JWT token o day
        return new ApiResponse(true, "Login successful", userDTO);
    }

    // Lay thong tin user hien tai
    public ApiResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        
        if (user == null) {
            return new ApiResponse(false, "User not found", null);
        }

        UserDTO userDTO = new UserDTO(user.getId(), user.getEmail(), user.getFullName());
        return new ApiResponse(true, "User found", userDTO);
    }

    // Cap nhat profile
    public ApiResponse updateProfile(Long userId, AuthRequest.UpdateProfileRequest request) {
        User user = userRepository.findById(userId).orElse(null);
        
        if (user == null) {
            return new ApiResponse(false, "User not found", null);
        }

        // Kiem tra email moi da ton tai chua (neu thay doi)
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return new ApiResponse(false, "Email already exists", null);
            }
            user.setEmail(request.getEmail());
        }

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }

        User updated = userRepository.save(user);
        UserDTO userDTO = new UserDTO(updated.getId(), updated.getEmail(), updated.getFullName());
        return new ApiResponse(true, "Profile updated successfully", userDTO);
    }

    // Doi mat khau
    public ApiResponse changePassword(Long userId, AuthRequest.ChangePasswordRequest request) {
        User user = userRepository.findById(userId).orElse(null);
        
        if (user == null) {
            return new ApiResponse(false, "User not found", null);
        }

        // Kiem tra mat khau cu
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return new ApiResponse(false, "Current password is incorrect", null);
        }

        // Hash mat khau moi
        String hashedPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(hashedPassword);
        
        userRepository.save(user);
        return new ApiResponse(true, "Password changed successfully", null);
    }
}
