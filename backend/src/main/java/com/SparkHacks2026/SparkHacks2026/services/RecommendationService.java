package com.SparkHacks2026.SparkHacks2026.services;

import com.SparkHacks2026.SparkHacks2026.models.Connection;
import com.SparkHacks2026.SparkHacks2026.models.Profile;
import com.SparkHacks2026.SparkHacks2026.repositories.ConnectionRepository;
import com.SparkHacks2026.SparkHacks2026.repositories.ProfileRepository;
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
        // We find all connections involving this profileId
        List<Connection> existingConnections = connectionRepository.findByUsersContaining(profileId);

        Set<String> excludedIds = existingConnections.stream()
                .flatMap(c -> c.getUsers().stream())
                .collect(Collectors.toSet());

        // Always exclude the user's own profile
        excludedIds.add(profileId);

        // 2. Fetch location-based profiles (Zipcode match) and filter out excluded IDs
        List<Profile> localProfiles = profileRepository.findByZipcode(zipcode).stream()
                .filter(p -> !excludedIds.contains(p.getId()))
                .collect(Collectors.toList());

        List<Profile> cardStack = new ArrayList<>(localProfiles);

        // 3. Random overall to fill the stack, again filtering out excluded IDs
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