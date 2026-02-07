package com.SparkHacks2026.SparkHacks2026.services;

import com.SparkHacks2026.SparkHacks2026.models.Profile;
import com.SparkHacks2026.SparkHacks2026.repositories.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {
    @Autowired private ProfileRepository profileRepository;

    public List<Profile> getRecommendedProfiles(String userId, String zipcode) {
        // This list will hold our final "stack" of cards

        // 1. Logic for Recently Connected/Endorsed (Fetch from ConnectionRepository)
        // [Add Logic here to prioritize specific IDs]

        // 2. Location-based profiles (Zipcode match)
        List<Profile> localProfiles = profileRepository.findByZipcode(zipcode).stream()
                .filter(p -> !p.getId().equals(userId))
                .toList();
        List<Profile> cardStack = new ArrayList<>(localProfiles);

        // 3. Random overall to fill the stack
        List<Profile> allProfiles = profileRepository.findAll();
        Collections.shuffle(allProfiles);

        for (Profile p : allProfiles) {
            if (!cardStack.contains(p) && !p.getId().equals(userId)) {
                cardStack.add(p);
            }
        }

        return cardStack;
    }
}