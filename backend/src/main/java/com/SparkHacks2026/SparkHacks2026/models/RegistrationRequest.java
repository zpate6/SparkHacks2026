package com.SparkHacks2026.SparkHacks2026.models;

import lombok.Data;

@Data
public class RegistrationRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String profession;
    private String zipcode;
    private String image;
}