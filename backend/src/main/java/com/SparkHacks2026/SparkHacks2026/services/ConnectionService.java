package com.SparkHacks2026.SparkHacks2026.services;

import com.SparkHacks2026.SparkHacks2026.models.Connection;
import com.SparkHacks2026.SparkHacks2026.repositories.ConnectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ConnectionService {
    @Autowired
    private ConnectionRepository connectionRepository;

    public Connection createConnection(Connection connection) {
        // Business logic: Initialize weight or validate users here
        return connectionRepository.save(connection);
    }

    public List<Connection> getUserNetwork(String userId) {
        return connectionRepository.findByUsersContaining(userId);
    }
}