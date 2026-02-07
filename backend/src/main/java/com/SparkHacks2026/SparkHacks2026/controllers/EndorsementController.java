package com.SparkHacks2026.SparkHacks2026.controllers;

import com.SparkHacks2026.SparkHacks2026.models.Endorsement;
import com.SparkHacks2026.SparkHacks2026.repositories.EndorsementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/endorsements")
@CrossOrigin(origins = "*")
public class EndorsementController {

    @Autowired
    private EndorsementRepository endorsementRepository;

    @PostMapping
    public Endorsement createEndorsement(@RequestBody CreateEndorsementRequest request) {
        Endorsement endorsement = new Endorsement();
        endorsement.setEndorserId(request.getEndorserId());
        endorsement.setEndorseeId(request.getEndorseeId());
        return endorsementRepository.save(endorsement);
    }

    public static class CreateEndorsementRequest {
        private String endorserId;
        private String endorseeId;

        public String getEndorserId() {
            return endorserId;
        }

        public void setEndorserId(String endorserId) {
            this.endorserId = endorserId;
        }

        public String getEndorseeId() {
            return endorseeId;
        }

        public void setEndorseeId(String endorseeId) {
            this.endorseeId = endorseeId;
        }
    }

    @GetMapping("/check")
    public boolean checkEndorsement(@RequestParam String endorserId, @RequestParam String endorseeId) {
        return endorsementRepository.existsByEndorserIdAndEndorseeId(endorserId, endorseeId);
    }
}
