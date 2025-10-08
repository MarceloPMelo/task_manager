package com.example.init_java.controller;

import com.example.init_java.model.User;
import com.example.init_java.repository.User.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.init_java.exceptions.BadRequestException;

@RestController
@RequestMapping("/users") // Endpoint base: /users
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    // GET /users → lista todos os usuários
    @GetMapping
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
           throw new BadRequestException("Usuário não encontrado");
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok("Usuário removido com sucesso");
    }
}