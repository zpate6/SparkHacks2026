package com.SparkHacks2026.SparkHacks2026.controllers;

import com.SparkHacks2026.SparkHacks2026.models.*;
import com.SparkHacks2026.SparkHacks2026.repositories.ConnectionRepository;
import com.SparkHacks2026.SparkHacks2026.repositories.ProfileRepository;
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

    @Autowired
    private ConnectionService connectionService;
    @Autowired
    private RecommendationService recommendationService;
    @Autowired
    private ConnectionRepository connectionRepository;
    @Autowired
    private ProfileRepository profileRepository;

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

    @GetMapping("/{userId}")
    public List<Profile> getConnections(
            @PathVariable String userId,
            @RequestParam(defaultValue = "ACCEPTED") String status) {

        List<Connection> connections = connectionRepository.findByUsersContainingAndStatus(userId, status);

        // Extract the OTHER user's ID from each connection
        List<String> connectionIds = connections.stream()
                .map(c -> c.getUsers().stream()
                        .filter(id -> !id.equals(userId))
                        .findFirst()
                        .orElse(null))
                .filter(id -> id != null)
                .toList();

        // Fetch profiles for these users
        // Use RecommendationService or define a new helper to fetch profiles by IDs
        // For simplicity, I'll direct inject ProfileRepository if not present, but
        // to avoid circular deps let's see if we can use an existing service.
        // I will add ProfileRepository specific query or just loop.
        // Ideally we should have `profileRepository.findAllById(connectionIds)`
        // NOTE: ProfileRepository extends MongoRepository which has findAllById.

        return profileRepository.findAllById(connectionIds);
    }
}
