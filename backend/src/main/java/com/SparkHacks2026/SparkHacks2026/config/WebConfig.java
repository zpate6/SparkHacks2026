package com.SparkHacks2026.SparkHacks2026.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Use an absolute path or ensure the directory exists relative to project root
        registry.addResourceHandler("/api/uploads/**")
                .addResourceLocations("file:./uploads/"); // Added ./ to specify project root
    }
}