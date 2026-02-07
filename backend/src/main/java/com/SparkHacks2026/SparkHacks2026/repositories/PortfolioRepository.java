package com.SparkHacks2026.SparkHacks2026.repositories;

import com.SparkHacks2026.SparkHacks2026.models.Portfolio;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PortfolioRepository extends MongoRepository<Portfolio, String> {

}
