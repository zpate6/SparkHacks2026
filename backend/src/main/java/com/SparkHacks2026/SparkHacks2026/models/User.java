package com.SparkHacks2026.SparkHacks2026.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String status; // ACTIVE, HIBERNATED
    private LocalDateTime createdAt = LocalDateTime.now();
    private String authId;
    private String profileId;
    private String portfolioId;
    private String analyticsId;

    // Getters and Setters
}