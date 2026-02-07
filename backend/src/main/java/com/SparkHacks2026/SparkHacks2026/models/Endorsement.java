package com.SparkHacks2026.SparkHacks2026.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "endorsements")
public class Endorsement {
    @Id
    private String id;
    private String endorserId;
    private String endorseeId;
    private LocalDateTime timestamp = LocalDateTime.now();
}
