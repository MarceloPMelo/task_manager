package com.example.init_java.dto;

public class ContactDto {
    private Long id;
    private String name;
    private String phone;
    private String email;
    private String company;
    private String jobTitle;
    private String address;
    private Long userId;

    public ContactDto() {}

    public ContactDto(Long id, String name, String phone, String email,
                      String company, String jobTitle, String address, Long userId) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.company = company;
        this.jobTitle = jobTitle;
        this.address = address;
        this.userId = userId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
