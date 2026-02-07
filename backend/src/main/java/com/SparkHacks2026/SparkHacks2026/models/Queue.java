package com.SparkHacks2026.SparkHacks2026.models;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@Document(collection = "queues")
public class Queue {
    // Getters and Setters
    @Id
    private String id;
    private String targetUserId; // Person who was swiped on
    private String requesterUserId; // Person who swiped
    private Date timestamp = new Date();
    private boolean isViewed = false;
    private double priorityScore; // Calculated by Matching Algorithm

}