package com.SparkHacks2026.SparkHacks2026.services;

import com.SparkHacks2026.SparkHacks2026.models.*;
import com.SparkHacks2026.SparkHacks2026.models.Queue;
import com.SparkHacks2026.SparkHacks2026.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ConnectionService {
    @Autowired private ConnectionRepository connectionRepository;
    @Autowired private ProfileRepository profileRepository;
    @Autowired private QueueRepository queueRepository;
    @Autowired private AnalyticsRepository analyticsRepository;

    // Logic for swiping right
    public void processSwipe(String requesterId, String targetId, boolean isRightSwipe) {
        // 1. Update target's Analytics (View Count and Rejection/Match)
        Analytics targetAnalytics = analyticsRepository.findById(targetId).orElse(new Analytics());
        targetAnalytics.setViewCount(targetAnalytics.getViewCount() + 1);

        if (!isRightSwipe) {
            targetAnalytics.setRejectionCount(targetAnalytics.getRejectionCount() + 1);
            analyticsRepository.save(targetAnalytics);
            return;
        }

        // 2. Check if the target has already swiped right on the requester (A Match)
        Connection existingPending = connectionRepository.findByUsersContaining(targetId).stream()
                .filter(c -> c.getUsers().contains(requesterId) && "PENDING".equals(c.getStatus()))
                .findFirst().orElse(null);

        if (existingPending != null) {
            existingPending.setStatus("ACCEPTED");
            existingPending.setRelationshipType("SWIPED");
            connectionRepository.save(existingPending);

            // Update Match Counts
            targetAnalytics.setMatchCount(targetAnalytics.getMatchCount() + 1);
            analyticsRepository.save(targetAnalytics);
        } else {
            // 3. No match yet: Add requester to target's Queue and create PENDING connection
            Queue queueEntry = new Queue();
            queueEntry.setRequesterUserId(requesterId);
            queueEntry.setTargetUserId(targetId);
            queueEntry.setPriorityScore(calculatePriority(requesterId, targetId));
            queueRepository.save(queueEntry);

            Connection connection = new Connection();
            connection.setUsers(Arrays.asList(requesterId, targetId));
            connection.setStatus("PENDING");
            connectionRepository.save(connection);
        }
    }

    // Finds the shortest path (up to 7 degrees) between two users
    public List<String> findConnectionPath(String startUserId, String targetUserId) {
        if (startUserId.equals(targetUserId)) return Collections.singletonList(startUserId);

        LinkedList<String> queue = new LinkedList<>();
        Map<String, String> predecessors = new HashMap<>();
        Set<String> visited = new HashSet<>();

        queue.add(startUserId);
        visited.add(startUserId);

        int depth = 0;
        while (!queue.isEmpty() && depth < 7) {
            int levelSize = queue.size();
            for (int i = 0; i < levelSize; i++) {
                String current = queue.poll();

                // Get all accepted neighbors
                List<String> neighbors = getAcceptedNeighbors(current);

                for (String neighbor : neighbors) {
                    if (!visited.contains(neighbor)) {
                        visited.add(neighbor);
                        predecessors.put(neighbor, current);

                        if (neighbor.equals(targetUserId)) {
                            return reconstructPath(predecessors, targetUserId);
                        }
                        queue.add(neighbor);
                    }
                }
            }
            depth++;
        }
        return Collections.emptyList(); // No path found within 7 degrees
    }

    private List<String> getAcceptedNeighbors(String userId) {
        return connectionRepository.findByUsersContaining(userId).stream()
                .filter(c -> "ACCEPTED".equals(c.getStatus()))
                .map(c -> c.getUsers().get(0).equals(userId) ? c.getUsers().get(1) : c.getUsers().get(0))
                .collect(Collectors.toList());
    }

    private List<String> reconstructPath(Map<String, String> predecessors, String target) {
        LinkedList<String> path = new LinkedList<>();
        for (String at = target; at != null; at = predecessors.get(at)) {
            path.addFirst(at);
        }
        return path;
    }

    public GraphDataResponse getNetworkGraph() {
        // 1. Get all accepted professional connections
        List<Connection> connections = connectionRepository.findAll().stream()
                .filter(c -> "ACCEPTED".equals(c.getStatus()))
                .collect(Collectors.toList());

        // 2. Extract unique user IDs involved in these connections
        Set<String> userIds = new HashSet<>();
        connections.forEach(c -> userIds.addAll(c.getUsers()));

        // 3. Fetch profiles to create labeled nodes
        List<Profile> profiles = profileRepository.findAllById(userIds);
        List<GraphDataResponse.Node> nodes = profiles.stream()
                .map(p -> new GraphDataResponse.Node(
                        p.getId(),
                        p.getFirstName() + " " + p.getLastName(),
                        p.getProfession()))
                .collect(Collectors.toList());

        // 4. Create links based on the connection records
        List<GraphDataResponse.Link> links = connections.stream()
                .map(c -> new GraphDataResponse.Link(
                        c.getUsers().get(0),
                        c.getUsers().get(1),
                        c.getRelationshipType()))
                .collect(Collectors.toList());

        return new GraphDataResponse(nodes, links);
    }


    private double calculatePriority(String reqId, String targetId) {
        // Placeholder for matching algorithm: could use shared genres or zipcode proximity
        return 1.0;
    }
}