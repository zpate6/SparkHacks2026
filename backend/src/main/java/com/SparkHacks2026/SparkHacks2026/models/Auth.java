package com.SparkHacks2026.SparkHacks2026.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "auth")
public class Auth {
    @Id
    private String id;
    private String email;
    private String passwordHash;

    // Getters and Setters
}