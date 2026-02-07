package com.SparkHacks2026.SparkHacks2026.repositories;

import com.SparkHacks2026.SparkHacks2026.models.Connection;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConnectionRepository extends MongoRepository<Connection, String> {
    // Custom query to find connections for a specific user
    java.util.List<Connection> findByUsersContaining(String userId);

    // Find connections by user and status
    java.util.List<Connection> findByUsersContainingAndStatus(String userId, String status);
}
