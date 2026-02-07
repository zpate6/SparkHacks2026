package com.SparkHacks2026.SparkHacks2026.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "profiles")
public class Profile {
    @Id
    private String id;
    private String firstName;
    private String lastName;
    private String profession;
    private String zipcode;
    private List<String> skills;
    private List<String> genres;
    private PreferredPay preferredPay;

    public static class PreferredPay {
        private double amount;
        private String type; // HOURLY, PER_PROJECT
        // Getters and Setters
    }
    // Getters and Setters
}