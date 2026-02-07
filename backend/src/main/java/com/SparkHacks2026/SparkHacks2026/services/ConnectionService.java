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

    public List<Map<String, String>> findConnectionPath(String fromProfileId, String toProfileId) {
        if (fromProfileId == null || toProfileId == null || fromProfileId.equals(toProfileId)) {
            return Collections.emptyList();
        }

        // 1. Setup BFS
        LinkedList<String> queue = new LinkedList<>();
        Map<String, String> predecessors = new HashMap<>();
        Set<String> visited = new HashSet<>();

        queue.add(fromProfileId);
        visited.add(fromProfileId);

        boolean found = false;
        while (!queue.isEmpty()) {
            String current = queue.poll();

            // 2. Fetch Neighbors
            List<String> neighbors = getProfileNeighbors(current);

            for (String neighbor : neighbors) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    predecessors.put(neighbor, current);

                    if (neighbor.equals(toProfileId)) {
                        found = true;
                        break;
                    }
                    queue.add(neighbor);
                }
            }
            if (found) break;
        }

        if (!found) return Collections.emptyList();

        // 3. Reconstruct Path
        List<String> path = reconstructPath(predecessors, toProfileId);
        List<Map<String, String>> result = new ArrayList<>();

        // 4. Build Response (With Fallback for missing Profiles)
        for (String pid : path) {
            Map<String, String> node = new HashMap<>();
            node.put("id", pid);

            // Try to look up the profile, but don't skip the node if missing
            Optional<Profile> pOpt = profileRepository.findById(pid);
            if (pOpt.isPresent()) {
                Profile p = pOpt.get();
                node.put("name", p.getFirstName() + " " + p.getLastName());
                node.put("profession", p.getProfession());
            } else {
                // Fallback so the graph still draws
                node.put("name", "User " + pid.substring(0, 4) + "...");
                node.put("profession", "Unknown");
            }
            result.add(node);
        }
        return result;
    }

    // Helper to find all Profile IDs connected to the given profileId
    private List<String> getProfileNeighbors(String profileId) {
        // Use the explicit status query to only traverse ACCEPTED matches
        List<Connection> connections = connectionRepository.findByUsersContainingAndStatus(profileId, "ACCEPTED");

        List<String> neighbors = new ArrayList<>();
        for (Connection c : connections) {
            List<String> users = c.getUsers();
            // Safety check
            if (users != null && users.contains(profileId)) {
                for (String u : users) {
                    // Add the user that is NOT me
                    if (!u.equals(profileId)) {
                        neighbors.add(u);
                    }
                }
            }
        }
        // Deduplicate in case of data errors
        return neighbors.stream().distinct().collect(Collectors.toList());
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