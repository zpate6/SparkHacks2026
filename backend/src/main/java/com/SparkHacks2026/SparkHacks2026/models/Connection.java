package com.SparkHacks2026.SparkHacks2026.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "connections")
public class Connection {
    @Id
    private String id;
    private List<String> users; // The two parties
    private String status; // PENDING, ACCEPTED
    private String relationshipType;
    private int pathWeight;
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
}