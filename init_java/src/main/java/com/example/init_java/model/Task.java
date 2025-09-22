package com.example.init_java.model;

import jakarta.persistence.*;

@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private boolean done;

    // Relacionamento com User
    @ManyToOne
    @JoinColumn(name = "user_id")  // coluna no banco
    private User user;

    // Construtor padrão
    public Task() {}

    // Getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isDone() { return done; }
    public void setDone(boolean done) { this.done = done; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
