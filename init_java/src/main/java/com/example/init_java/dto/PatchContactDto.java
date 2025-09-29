package com.example.init_java.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;


public class PatchContactDto {

    private String name;
    private String phone;

    @Email(message = "Email inválidooo")
    @Column(nullable = false, unique = true)
    private String email;

    private String company;
    private String jobTitle;
    private String address;

    // Construtor padrão
    public PatchContactDto() {}


    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
}
