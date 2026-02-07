package com.SparkHacks2026.SparkHacks2026.services;

import com.SparkHacks2026.SparkHacks2026.models.Connection;
import com.SparkHacks2026.SparkHacks2026.models.Profile;
import com.SparkHacks2026.SparkHacks2026.repositories.ConnectionRepository;
import com.SparkHacks2026.SparkHacks2026.repositories.ProfileRepository;
import com.SparkHacks2026.SparkHacks2026.repositories.QueueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {
    @Autowired
    private ProfileRepository profileRepository;
    @Autowired
    private ConnectionRepository connectionRepository;

    public List<Profile> getRecommendedProfiles(String profileId, String zipcode) {
        // 1. Get IDs of people this user has already swiped on or matched with
        // We fetch all connections where this user is a participant
        List<Connection> existingConnections = connectionRepository.findByUsersContaining(profileId);

        // Exclude anyone where a connection already exists (Pending or Accepted)
        // to prevent duplicate swipes or seeing people you already matched with
        Set<String> excludedIds = existingConnections.stream()
                .filter(c -> c.getStatus().equals("ACCEPTED"))
                .flatMap(c -> c.getUsers().stream())
                .collect(Collectors.toSet());

        // Always exclude the user's own profile
        excludedIds.add(profileId);

        // 3. PRIORITY: Get "Awaiting" profiles (Pending connections where YOU are the target)
        // We filter for PENDING and then convert the List from findAllById into a Stream
        List<Profile> awaitingProfiles = existingConnections.stream()
                .filter(c -> "PENDING".equals(c.getStatus()))
                .flatMap(c -> profileRepository.findAllById(c.getUsers()).stream()) // Added .stream() here to fix the error
                .filter(p -> !p.getId().equals(profileId)) // Don't add yourself to your own stack
                .toList();

        List<Profile> cardStack = new ArrayList<>(awaitingProfiles);

        // 4. Random overall to fill the stack
        List<Profile> allProfiles = profileRepository.findAll();
        Collections.shuffle(allProfiles);

        for (Profile p : allProfiles) {
            if (!cardStack.contains(p) && !excludedIds.contains(p.getId())) {
                cardStack.add(p);
            }
        }

        return cardStack;
    }
}