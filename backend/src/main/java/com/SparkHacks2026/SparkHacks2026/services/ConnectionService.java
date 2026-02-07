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
    @Autowired private UserRepository userRepository;
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
    public List<Map<String, String>> findConnectionPath(String fromProfileId, String toProfileId) {
        // 1. Resolve Profile IDs to User IDs
        User startUser = userRepository.findByProfileId(fromProfileId).orElse(null);
        User targetUser = userRepository.findByProfileId(toProfileId).orElse(null);

        if (startUser == null || targetUser == null) return Collections.emptyList();

        String startUserId = startUser.getId();
        String targetUserId = targetUser.getId();

        if (startUserId.equals(targetUserId)) return Collections.emptyList();

        LinkedList<String> queue = new LinkedList<>();
        Map<String, String> predecessors = new HashMap<>();
        Set<String> visited = new HashSet<>();

        queue.add(startUserId);
        visited.add(startUserId);

        int depth = 0;
        boolean found = false;
        while (!queue.isEmpty() && depth < 10) {
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
                            found = true;
                            break;
                        }
                        queue.add(neighbor);
                    }
                }
                if (found) break;
            }
            if (found) break;
            depth++;
        }
        if (!found) return Collections.emptyList();

        // 3. Reconstruct Path and attach Profile Names
        List<String> userPath = reconstructPath(predecessors, targetUserId);
        List<Map<String, String>> result = new ArrayList<>();

        for (String uid : userPath) {
            User u = userRepository.findById(uid).orElse(null);
            Profile p = (u != null) ? profileRepository.findById(u.getProfileId()).orElse(null) : null;

            Map<String, String> node = new HashMap<>();
            node.put("id", uid);
            node.put("name", p != null ? p.getFirstName() + " " + p.getLastName() : "Unknown");
            result.add(node);
        }
        return result;
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
        // 1. Fetch all connections (including PENDING)
        List<Connection> connections = connectionRepository.findAll();

        // 2. Extract unique Profile IDs directly from the connections
        Set<String> profileIds = new HashSet<>();
        for (Connection c : connections) {
            profileIds.addAll(c.getUsers()); // These are profileIds
        }

        // 3. Fetch the corresponding Profiles directly
        List<Profile> profiles = profileRepository.findAllById(profileIds);
        Map<String, Profile> profileMap = profiles.stream()
                .collect(Collectors.toMap(Profile::getId, p -> p));

        // 4. Build the Nodes for D3
        List<GraphDataResponse.Node> nodes = new ArrayList<>();
        for (Profile profile : profiles) {
            nodes.add(new GraphDataResponse.Node(
                    profile.getId(), // Using profileId as the unique node ID
                    profile.getFirstName() + " " + profile.getLastName(),
                    profile.getProfession()));
        }

        // 5. Build the Links
        // Ensure both source and target profileIds exist in our node list
        Set<String> validProfileIds = nodes.stream()
                .map(GraphDataResponse.Node::getId)
                .collect(Collectors.toSet());

        List<GraphDataResponse.Link> links = connections.stream()
                .filter(c -> validProfileIds.contains(c.getUsers().get(0)) &&
                             validProfileIds.contains(c.getUsers().get(1)))
                .map(c -> new GraphDataResponse.Link(
                        c.getUsers().get(0), // profileId 1
                        c.getUsers().get(1), // profileId 2
                        c.getRelationshipType(),
                        c.getStatus())) // "PENDING" or "ACCEPTED"
                .collect(Collectors.toList());

        return new GraphDataResponse(nodes, links);
    }


    private double calculatePriority(String reqId, String targetId) {
        // Placeholder for matching algorithm: could use shared genres or zipcode proximity
        return 1.0;
    }
}