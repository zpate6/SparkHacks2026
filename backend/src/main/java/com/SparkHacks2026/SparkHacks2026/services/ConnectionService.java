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
        // 1. Get all accepted professional connections
        List<Connection> connections = connectionRepository.findAll().stream()
                .filter(c -> "ACCEPTED".equals(c.getStatus()))
                .toList();

        // 2. Extract unique user IDs involved in these connections
        Set<String> userIds = new HashSet<>();
        connections.forEach(c -> userIds.addAll(c.getUsers()));

        // 3. Fetch User objects to get their linked Profile IDs
        List<User> users = userRepository.findAllById(userIds);

        // Create a map of User ID -> Profile ID for easy lookup
        Map<String, String> userToProfileMap = users.stream()
                .collect(Collectors.toMap(User::getId, User::getProfileId));

        // 4. Fetch the Profiles using the mapped IDs
        List<Profile> profiles = profileRepository.findAllById(userToProfileMap.values());
        Map<String, Profile> profileMap = profiles.stream()
                .collect(Collectors.toMap(Profile::getId, p -> p));

        // 5. Build the Nodes using User IDs (to match link references)
        List<GraphDataResponse.Node> nodes = new ArrayList<>();
        for (User user : users) {
            Profile profile = profileMap.get(user.getProfileId());
            if (profile != null) {
                nodes.add(new GraphDataResponse.Node(
                        user.getId(),
                        profile.getFirstName() + " " + profile.getLastName(),
                        profile.getProfession()));
            }
        }

        // 6. Build and FILTER Links
        // Only include links where BOTH nodes exist in our final nodes list
        Set<String> validNodeIds = nodes.stream().map(n -> n.getId()).collect(Collectors.toSet());

        List<GraphDataResponse.Link> links = connections.stream()
                .filter(c -> validNodeIds.contains(c.getUsers().get(0)) &&
                             validNodeIds.contains(c.getUsers().get(1)))
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