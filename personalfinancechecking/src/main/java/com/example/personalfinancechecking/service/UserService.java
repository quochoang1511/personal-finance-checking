package com.example.personalfinancechecking.service;

import org.springframework.stereotype.Service;

import com.example.personalfinancechecking.dto.UserDTO;
import com.example.personalfinancechecking.dto.UserLoginDTO;
import com.example.personalfinancechecking.entity.ApiResponse;
import com.example.personalfinancechecking.entity.User;
import com.example.personalfinancechecking.repository.UserRepository;

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
            userDTO = new UserDTO(user.getUserId(), user.getEmail(), user.getFullName());
            return new ApiResponse(true, "Tìm thấy người dùng", userDTO);
        } else {
            return new ApiResponse(false, "Không tìm thấy người dùng", null);
        }
    }

    public ApiResponse findByEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        UserDTO userDTO = new UserDTO();
        if (user != null) {
            userDTO = new UserDTO(user.getUserId(), user.getEmail(), user.getFullName());
            return new ApiResponse(true, "Tìm thấy người dùng", userDTO);
        } else {
            return new ApiResponse(false, "Không tìm thấy người dùng", null);
        }
    }

    public ApiResponse Login(UserLoginDTO userLoginDTO) {
        User user = userRepository.findByEmail(userLoginDTO.getEmail()).orElse(null);
        UserLoginDTO userDTO = new UserLoginDTO();
        if (user == null) {
            return new ApiResponse(false, "Tài khoản không tồn tại", null);
        } else {
            if (user.getEmail().equals(userLoginDTO.getEmail())
                    && user.getPassword().equals(userLoginDTO.getPassword())) {
                return new ApiResponse(true, "Đăng nhập thành công", userDTO.getEmail());
            }
            return new ApiResponse(false, "Sai mật khẩu", userDTO);
        }
    }

    public ApiResponse createUser(User user) {
        boolean emailExists = userRepository.findByEmail(user.getEmail()).isPresent();
        if (emailExists) {
            return new ApiResponse(false, "Email đã tồn tại", null);
        }
        if (user.getPassword() == null) {
            return new ApiResponse(false, "Mật khẩu không không thể để trống ", null);
        }
        user.setUserId(null);
        user = userRepository.save(user);
        return new ApiResponse(true, "Tạo người dùng thành công", user);
    }

    public ApiResponse getUsers() {
        var user = userRepository.findAll();
        return new ApiResponse(true, "Tìm thấy danh sách người dùng", user);
    }
}