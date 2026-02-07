package com.SparkHacks2026.SparkHacks2026.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "analytics")
public class Analytics {
    @Id
    private String id;
    private int viewCount;
    private int matchCount;
    private int rejectionCount;

    // Getters and Setters
}