package com.SparkHacks2026.SparkHacks2026.controllers;

import com.SparkHacks2026.SparkHacks2026.models.*;
import com.SparkHacks2026.SparkHacks2026.repositories.QueueRepository;
import com.SparkHacks2026.SparkHacks2026.services.ConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/connections")
@CrossOrigin(origins = "*")
public class ConnectionController {

    @Autowired
    private ConnectionService connectionService;
    @Autowired
    private QueueRepository queueRepository;

    // Get the queue for the Home Page
    @GetMapping("/queue/{userId}")
    public List<Queue> getMyQueue(@PathVariable String userId) {
        // Return people who swiped on the user, ordered by priority score
        return queueRepository.findByTargetUserIdOrderByPriorityScoreDesc(userId);
    }

    // Endpoint for swiping
    @PostMapping("/swipe")
    public void swipe(@RequestParam String requesterId,
                      @RequestParam String targetId,
                      @RequestParam boolean rightSwipe) {
        if (rightSwipe) {
            connectionService.handleSwipeRight(requesterId, targetId);
        }
        // Logic for left swipe (rejection count update in Analytics) can go here
    }

    // Path of connection (7-degree idea)
    @GetMapping("/path")
    public List<String> getConnectionPath(@RequestParam String userA, @RequestParam String userB) {
        // Logic to calculate BFS path through accepted connections
        return null; // Implementation for the matching algorithm
    }
}