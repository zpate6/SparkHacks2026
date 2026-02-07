package com.SparkHacks2026.SparkHacks2026.repositories;

import com.SparkHacks2026.SparkHacks2026.models.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    // Custom query to find by status
    List<User> findByStatus(String status);
    List<User> findAllById(Collection<String> id);

    User findByAuthId(String authId);

    Optional<User> findByProfileId(String profileId);

    List<User> findAllByProfileId(Collection<String> profileId);
}
