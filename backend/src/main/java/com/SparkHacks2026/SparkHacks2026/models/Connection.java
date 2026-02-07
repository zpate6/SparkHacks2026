package com.SparkHacks2026.SparkHacks2026.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Data
@Document(collection = "connections")
public class Connection {
    @Id
    private String id;
    private List<String> users; // The two parties
    private String status; // PENDING, ACCEPTED
    private String relationshipType;
    private int pathWeight;
    private LocalDateTime createdAt = LocalDateTime.now();

    // Add these Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public List<String> getUsers() { return users; }
    public void setUsers(List<String> users) { this.users = users; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRelationshipType() { return relationshipType; }
    public void setRelationshipType(String relationshipType) { this.relationshipType = relationshipType; }

    public int getPathWeight() { return pathWeight; }
    public void setPathWeight(int pathWeight) { this.pathWeight = pathWeight; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    // Getters and Setters
}