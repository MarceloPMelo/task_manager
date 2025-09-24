package com.example.init_java.dto;

public class TaskResponseDto {
    private Long id;
    private String title;
    private String description;
    private Long userId;
    private boolean done;

    public TaskResponseDto() {}

    public TaskResponseDto(Long id, String title, String description, Long userId, boolean done) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.userId = userId;
        this.done = done;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean getDone() { return done; }
    public void setDone(boolean done) { this.done = done; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
} 