package com.SparkHacks2026.SparkHacks2026.controllers;

import com.SparkHacks2026.SparkHacks2026.models.*;
import com.SparkHacks2026.SparkHacks2026.repositories.AnalyticsRepository;
import com.SparkHacks2026.SparkHacks2026.repositories.ConnectionRepository;
import com.SparkHacks2026.SparkHacks2026.repositories.QueueRepository;
import com.SparkHacks2026.SparkHacks2026.services.ConnectionService;
import com.SparkHacks2026.SparkHacks2026.services.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/connections")
@CrossOrigin(origins = "*")
public class ConnectionController {

    @Autowired private ConnectionService connectionService;
    @Autowired private RecommendationService recommendationService;
    @Autowired private ConnectionRepository connectionRepository;

    // Get the dynamic stack for the Home Page
    @GetMapping("/cards/{userId}")
    public List<Profile> getHomeCards(@PathVariable String userId, @RequestParam String zipcode) {
        return recommendationService.getRecommendedProfiles(userId, zipcode);
    }

    // Handle a swipe action
    @PostMapping("/swipe")
    public void swipe(@RequestParam String requesterId,
                      @RequestParam String targetId,
                      @RequestParam boolean rightSwipe) {
        connectionService.processSwipe(requesterId, targetId, rightSwipe);
    }

    @GetMapping("/path")
    public List<Map<String, String>> getPath(@RequestParam String from, @RequestParam String to) {
        return connectionService.findConnectionPath(from, to);
    }

    @PostMapping("/test/manual")
    public Connection createTestConnection(
            @RequestParam String user1,
            @RequestParam String user2,
            @RequestParam String status) {

        Connection connection = new Connection();
        connection.setUsers(Arrays.asList(user1, user2));
        connection.setStatus("ACCEPTED"); // Use "ACCEPTED" for testing mutual matches
        connection.setRelationshipType("WORKED_WITH");
        connection.setPathWeight(1);

        return connectionRepository.save(connection);
    }

    @GetMapping("/graph")
    public GraphDataResponse getGlobalGraph() {
        return connectionService.getNetworkGraph();
    }
}
