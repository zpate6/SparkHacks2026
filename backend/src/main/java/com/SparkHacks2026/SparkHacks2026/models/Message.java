package com.SparkHacks2026.SparkHacks2026.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Date;

@Document(collection = "messages")
public class Message {
    @Id
    private String id;
    private List<String> participants;
    private List<ChatMessage> messages;

    public static class ChatMessage {
        private String senderId;
        private String text;
        private Date timestamp = new Date();
        private boolean read = false;
        // Getters and Setters
    }
    // Getters and Setters
}