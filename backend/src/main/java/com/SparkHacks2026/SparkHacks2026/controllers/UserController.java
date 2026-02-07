package com.SparkHacks2026.SparkHacks2026.controllers;

import com.SparkHacks2026.SparkHacks2026.models.User;
import com.SparkHacks2026.SparkHacks2026.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Allows your frontend to connect
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // GET all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // POST a new user
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }
}
