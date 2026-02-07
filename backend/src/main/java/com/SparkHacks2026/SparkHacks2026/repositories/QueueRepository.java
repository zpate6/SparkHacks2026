package com.SparkHacks2026.SparkHacks2026.repositories;

import com.SparkHacks2026.SparkHacks2026.models.Queue;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface QueueRepository extends MongoRepository<Queue, String> {
    /**
     * Finds all queue entries for a target user,
     * ordered by their priority score in descending order.
     */
    List<Queue> findByTargetUserIdOrderByPriorityScoreDesc(String targetUserId);
}
