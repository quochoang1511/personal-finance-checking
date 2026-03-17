package com.example.personalfinancechecking.controller;

import com.example.personalfinancechecking.dto.AuthRequest;
import com.example.personalfinancechecking.entity.ApiResponse;
import com.example.personalfinancechecking.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // POST /api/auth/register - Dang ky
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody AuthRequest.RegisterRequest request) {
        ApiResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    // POST /api/auth/login - Dang nhap
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody AuthRequest.LoginRequest request) {
        ApiResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // GET /api/auth/me - Lay thong tin user hien tai
    // Trong thuc te, userId se lay tu JWT token
    @GetMapping("/me")
    public ResponseEntity<ApiResponse> getCurrentUser(@RequestHeader("X-User-Id") Long userId) {
        ApiResponse response = authService.getCurrentUser(userId);
        return ResponseEntity.ok(response);
    }

    // PUT /api/auth/profile - Cap nhat profile
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse> updateProfile(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody AuthRequest.UpdateProfileRequest request) {
        ApiResponse response = authService.updateProfile(userId, request);
        return ResponseEntity.ok(response);
    }

    // PUT /api/auth/password - Doi mat khau
    @PutMapping("/password")
    public ResponseEntity<ApiResponse> changePassword(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody AuthRequest.ChangePasswordRequest request) {
        ApiResponse response = authService.changePassword(userId, request);
        return ResponseEntity.ok(response);
    }

    // POST /api/auth/logout - Dang xuat
    // Trong thuc te, ban se invalidate JWT token o day
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout() {
        return ResponseEntity.ok(new ApiResponse(true, "Logout successful", null));
    }
}
