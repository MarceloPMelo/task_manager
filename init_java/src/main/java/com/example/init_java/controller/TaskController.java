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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.init_java.service.JwtService;
import com.example.init_java.repository.UserRepository;
import com.example.init_java.model.User;
import com.example.init_java.dto.TaskResponseDto;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;

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
            taskDto.setDone(createdTask.isDone());

            res.put("message", "Task criada com sucesso");
            res.put("task", taskDto);
            return ResponseEntity.status(200).body(res);
        } catch (Exception e) {

            res.put("error", e.getMessage());
            return ResponseEntity.status(401).body(res);
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getTasks(
            @CookieValue(value = "jwt", defaultValue = "") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (token.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Token não encontrado"));
        }

        try {
            Long userId = jwtService.extractId(token);

            // Cria o objeto Pageable para paginação
            Pageable pageable = PageRequest.of(page, size);
            Page<Task> tasksPage = taskRepository.findByUser_Id(userId, pageable);

            // Mapeia cada Task para TaskResponseDto
            List<TaskResponseDto> tasksDto = tasksPage.getContent().stream()
                    .map(task -> new TaskResponseDto(
                            task.getId(),
                            task.getTitle(),
                            task.getDescription(),
                            task.getUser().getId(), // pega apenas o ID do usuário
                            task.isDone()))
                    .toList();

            Map<String, Object> res = new HashMap<>();
            res.put("tasks", tasksDto);
            res.put("currentPage", tasksPage.getNumber());
            res.put("totalPages", tasksPage.getTotalPages());
            res.put("totalElements", tasksPage.getTotalElements());
            res.put("size", tasksPage.getSize());
            res.put("hasNext", tasksPage.hasNext());
            res.put("hasPrevious", tasksPage.hasPrevious());

            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Token inválido ou expirado"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteTask(
            @PathVariable Long id) {

        Map<String, Object> res = new HashMap<>();

        Optional<Task> optTask = taskRepository.findById(id);
        if (optTask.isEmpty()) {
            res.put("error", "Task não encontrada");
            return ResponseEntity.status(404).body(res);
        }

        try {
            taskRepository.deleteById(id);
            res.put("message", "Task deletada com sucesso");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.status(500).body(res);
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> patchTask(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {

        Map<String, Object> res = new HashMap<>();

        Optional<Task> optTask = taskRepository.findById(id);
        if (optTask.isEmpty()) {
            res.put("error", "Task não encontrada");
            return ResponseEntity.status(404).body(res);
        }

        try {
            Task existingTask = optTask.get();

            // Atualiza apenas os campos presentes no body
            if (updates.containsKey("title")) {
                existingTask.setTitle((String) updates.get("title"));
            }
            if (updates.containsKey("description")) {
                existingTask.setDescription((String) updates.get("description"));
            }
            if (updates.containsKey("done")) {
                existingTask.setDone((Boolean) updates.get("done"));
            }

            TaskResponseDto taskDto = new TaskResponseDto(
                            existingTask.getId(),
                            existingTask.getTitle(),
                            existingTask.getDescription(),
                            existingTask.getUser().getId(), // pega apenas o ID do usuário
                            existingTask.isDone());
            taskRepository.save(existingTask);

            res.put("message", "Task atualizada com sucesso");
            res.put("task", taskDto);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.status(500).body(res);
        }
    }

}