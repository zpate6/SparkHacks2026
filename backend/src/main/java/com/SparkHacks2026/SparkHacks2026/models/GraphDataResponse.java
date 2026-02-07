package com.SparkHacks2026.SparkHacks2026.models;

import lombok.Data;

import java.util.List;

@Data
public class GraphDataResponse {
    private List<Node> nodes;
    private List<Link> links;

    public GraphDataResponse(List<Node> nodes, List<Link> links) {
        this.nodes = nodes;
        this.links = links;
    }

    @Data
    public static class Node {
        private String id;
        private String label;
        private String profession;

        public Node(String id, String label, String profession) {
            this.id = id;
            this.label = label;
            this.profession = profession;
        }
        // Getters and Setters
    }

    @Data
    public static class Link {
        private String source;
        private String target;
        private String type;
        private String status;

        public Link(String source, String target, String type, String status) {
            this.source = source;
            this.target = target;
            this.type = type;
            this.status = status;
        }
        // Getters and Setters
    }
    // Getters and Setters
}