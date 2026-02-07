package com.SparkHacks2026.SparkHacks2026.repositories;

import com.SparkHacks2026.SparkHacks2026.models.Profile;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProfileRepository extends MongoRepository<Profile, String> {
    List<Profile> findByZipcode(String zipcode);
    List<Profile> findByProfessionAndGenresContaining(String profession, String genre);
}
