package com.SparkHacks2026.SparkHacks2026.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "portfolios")
public class Portfolio {
    @Id
    private String id;
    private String resumeUrl;
    private List<Experience> experience;
    private List<String> mediaLinks;

    public static class Experience {
        private String title;
        private String project;
        private int year;
        // Getters and Setters
    }
    // Getters and Setters
}