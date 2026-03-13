package com.example.personalfinancechecking.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.personalfinancechecking.service.UserService;
import com.example.personalfinancechecking.entity.User;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.example.personalfinancechecking.entity.ApiResponse;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getUsers() {
        return userService.getUsers();
    }

    @GetMapping("/{id}")
    public ApiResponse getUserById(@PathVariable Long id) {
         return userService.findById(id);
    }

    @GetMapping("/email/{email}")
    public ApiResponse getUserByEmail(@PathVariable String email) {
        return userService.findByEmail(email);
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }
    
}