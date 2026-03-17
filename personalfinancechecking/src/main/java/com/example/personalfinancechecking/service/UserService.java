package com.example.personalfinancechecking.service;

import org.springframework.stereotype.Service;

import com.example.personalfinancechecking.dto.UserDTO;
import com.example.personalfinancechecking.entity.APIResponse;
import com.example.personalfinancechecking.entity.User;
import com.example.personalfinancechecking.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public APIResponse findById(Long id) {
        User user = userRepository.findById(id).orElse(null);
        UserDTO userDTO = new UserDTO();
        if (user != null) {
            userDTO = new UserDTO(user.getUserId(), user.getEmail(), user.getFullName());
            return new APIResponse(true, "User found", userDTO);
        } else {
            return new APIResponse(false, "User not found", null);
        }
    }

    public APIResponse findByEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        UserDTO userDTO = new UserDTO();
        if (user != null) {
            userDTO = new UserDTO(user.getUserId(), user.getEmail(), user.getFullName());
            return new APIResponse(true, "User found", userDTO);
        } else {
            return new APIResponse(false, "User not found", null);
        }
    }

    public APIResponse createUser(User user) {
        boolean emailExists = userRepository.findByEmail(user.getEmail()).isPresent();
        if (emailExists) {
            return new APIResponse(false, "Email already exists", null);
        }
        if (user.getPassword()==null) {
            return new APIResponse(false, "Password cant be null ", null);
        }
        user.setUserId(null);
        user = userRepository.save(user);
        return new APIResponse(true, "User created successfully", user);
    }

    public APIResponse getUsers() {
        var user = userRepository.findAll();
        return new APIResponse(true, "User created successfully", user);
    }
}