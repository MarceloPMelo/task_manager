package com.example.init_java.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import com.example.init_java.model.Task;
import com.example.init_java.repository.TaskRepository;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.init_java.service.JwtService;
import com.example.init_java.repository.UserRepository;
import com.example.init_java.model.User;
import com.example.init_java.dto.TaskResponseDto;
import org.springframework.web.bind.annotation.CrossOrigin;


import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TaskController {

    private final TaskRepository taskRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // POST /tasks → cria uma nova tarefa vinculada ao usuário do token
    @PostMapping
    public ResponseEntity<Map<String, Object>> createTask(
            @CookieValue(value = "jwt", defaultValue = "") String token,
            @RequestBody Task task) {
        Map<String, Object> res = new HashMap<>();
        if (token.isEmpty()) {

            res.put("message", "Token não encontrado");
            return ResponseEntity.status(401).body(res);
        }

        try {
            Long userId = jwtService.extractId(token);
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {

                res.put("message", "Usuario não encontrado");
                return ResponseEntity.status(401).body(res);
            }

            task.setUser(userOpt.get());
            Task createdTask = taskRepository.save(task);
            TaskResponseDto taskDto = new TaskResponseDto();
            taskDto.setId(createdTask.getId());
            taskDto.setTitle(createdTask.getTitle());
            taskDto.setDescription(createdTask.getDescription());
            taskDto.setUserId(createdTask.getUser().getId());

            res.put("message", "Task criada com sucesso");
            res.put("task", taskDto);
            return ResponseEntity.status(200).body(res);
        } catch (Exception e) {

            res.put("error", e.getMessage());
            return ResponseEntity.status(401).body(res);        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getTasks(
            @CookieValue(value = "jwt", defaultValue = "") String token) {
        if (token.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Token não encontrado"));
        }

        try {
            Long userId = jwtService.extractId(token);
            List<Task> tasks = taskRepository.findByUser_Id(userId);

            // Mapeia cada Task para TaskResponseDto
            List<TaskResponseDto> tasksDto = tasks.stream()
                    .map(task -> new TaskResponseDto(
                            task.getId(),
                            task.getTitle(),
                            task.getDescription(),
                            task.getUser().getId() // pega apenas o ID do usuário
                    ))
                    .toList();

            Map<String, Object> res = new HashMap<>();
            res.put("tasks", tasksDto);
            res.put("count", tasksDto.size());

            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Token inválido ou expirado"));
        }
    }

}