package com.SparkHacks2026.SparkHacks2026.repositories;

import com.SparkHacks2026.SparkHacks2026.models.Endorsement;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EndorsementRepository extends MongoRepository<Endorsement, String> {
    List<Endorsement> findByEndorseeId(String endorseeId);

    boolean existsByEndorserIdAndEndorseeId(String endorserId, String endorseeId);
}
