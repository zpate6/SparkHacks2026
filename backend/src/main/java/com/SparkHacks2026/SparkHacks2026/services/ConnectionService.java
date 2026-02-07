package com.SparkHacks2026.SparkHacks2026.services;

import com.SparkHacks2026.SparkHacks2026.models.*;
import com.SparkHacks2026.SparkHacks2026.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Arrays;

@Service
public class ConnectionService {
    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private QueueRepository queueRepository;

    // Logic for swiping right
    public void handleSwipeRight(String requesterId, String targetId) {
        // Check if target has already swiped on requester
        Connection existingRequest = connectionRepository.findByUsersContaining(targetId)
                .stream()
                .filter(c -> c.getUsers().contains(requesterId) && "PENDING".equals(c.getStatus()))
                .findFirst()
                .orElse(null);

        if (existingRequest != null) {
            // It's a match!
            existingRequest.setStatus("ACCEPTED");
            existingRequest.setRelationshipType("SWIPED");
            connectionRepository.save(existingRequest);
        } else {
            // Add to target's queue
            Queue queueEntry = new Queue();
            queueEntry.setRequesterUserId(requesterId);
            queueEntry.setTargetUserId(targetId);
            // Example scoring: higher if in same zipcode or network proximity
            queueEntry.setPriorityScore(1.0);
            queueRepository.save(queueEntry);

            // Create a pending connection
            Connection pending = new Connection();
            pending.setUsers(Arrays.asList(requesterId, targetId));
            pending.setStatus("PENDING");
            connectionRepository.save(pending);
        }
    }
}