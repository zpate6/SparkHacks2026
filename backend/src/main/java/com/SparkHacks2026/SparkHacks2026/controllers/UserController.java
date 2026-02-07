package com.SparkHacks2026.SparkHacks2026.controllers;

import com.SparkHacks2026.SparkHacks2026.models.*;
import com.SparkHacks2026.SparkHacks2026.repositories.AuthRepository;
import com.SparkHacks2026.SparkHacks2026.repositories.PortfolioRepository;
import com.SparkHacks2026.SparkHacks2026.repositories.ProfileRepository;
import com.SparkHacks2026.SparkHacks2026.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Allows your frontend to connect
public class UserController {

    @Autowired private UserRepository userRepository;
    @Autowired private AuthRepository authRepository;
    @Autowired private ProfileRepository profileRepository;
    @Autowired private PortfolioRepository portfolioRepository;

    // GET all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // POST a new user with a 201 Created status
    @PostMapping("/register")
    public User registerUser(@RequestBody RegistrationRequest request) {
        // 1. Create and save Auth document
        Auth auth = new Auth();
        auth.setEmail(request.getEmail());
        auth.setPasswordHash(request.getPassword()); // Add hashing logic
        auth = authRepository.save(auth);

        // 2. Create and save Profile document
        Profile profile = new Profile();
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setProfession(request.getProfession());
        profile.setZipcode(request.getZipcode());
        profile.setImage(request.getImage());
        profile = profileRepository.save(profile);

        // 3. Create an empty Portfolio so the ID is not null
        Portfolio portfolio = new Portfolio();
        portfolio = portfolioRepository.save(portfolio);

        // 4. Link them to the main User document
        User user = new User();
        user.setAuthId(auth.getId());
        user.setProfileId(profile.getId());
        user.setProfileId(portfolio.getId());
        user.setStatus("ACTIVE");



        return userRepository.save(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest request) {
        Auth auth = authRepository.findByEmail(request.getEmail());
        if (auth != null && auth.getPasswordHash().equals(request.getPassword())) {
            return userRepository.findByAuthId(auth.getId());
        }
        throw new RuntimeException("Invalid credentials");
    }

    @GetMapping("/by-profile/{profileId}")
    public User getUserByProfile(@PathVariable String profileId) {
        return userRepository.findByProfileId(profileId)
                .orElseThrow(() -> new RuntimeException("User not found for profile: " + profileId));
    }

    @GetMapping("/profile/{profileId}")
    public Profile getProfile(@PathVariable String profileId) {
        return profileRepository.findById(profileId).orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    @GetMapping("/portfolio/{id}")
    public Portfolio getPortfolio(@PathVariable String id) {
        return portfolioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
    }
}
