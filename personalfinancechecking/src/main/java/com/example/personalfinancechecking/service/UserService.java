package com.example.personalfinancechecking.service;

import org.springframework.stereotype.Service;

import com.example.personalfinancechecking.dto.UserDTO;
import com.example.personalfinancechecking.entity.ApiResponse;
import com.example.personalfinancechecking.entity.User;
import com.example.personalfinancechecking.repository.UserRepository;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ApiResponse findById(Long id) {
        User user = userRepository.findById(id).orElse(null);
        UserDTO userDTO = new UserDTO();
        if (user != null) {
            userDTO = new UserDTO(user.getId(), user.getEmail(), user.getFullName());
            return new ApiResponse(true, "User found", userDTO);
        } else {
            return new ApiResponse(false, "User not found", null);
        }
    }

    public ApiResponse findByEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        UserDTO userDTO = new UserDTO();
        if (user != null) {
            userDTO = new UserDTO(user.getId(), user.getEmail(), user.getFullName());
            return new ApiResponse(true, "User found", userDTO);
        } else {
            return new ApiResponse(false, "User not found", null);
        }
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }
}