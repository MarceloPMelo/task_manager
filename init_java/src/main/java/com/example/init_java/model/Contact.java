package com.example.init_java.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    private String name;

    @NotBlank(message = "Telefone é obrigatório")
    private String phone;

    @Email(message = "Email inválido")
    @NotBlank(message = "Email é obrigatório")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Empresa é obrigatória")
    private String company;

    @NotBlank(message = "Cargo é obrigatório")
    private String jobTitle;

    @NotBlank(message = "Endereço é obrigatório")
    private String address;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Construtor padrão
    public Contact() {}

    // Construtor completo
    public Contact(String name, String phone, String email, String company, String jobTitle, String address, User user) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.company = company;
        this.jobTitle = jobTitle;
        this.address = address;
        this.user = user;
    }

    // Getters e setters
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

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
