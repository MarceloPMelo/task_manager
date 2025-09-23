package com.example.init_java.controller;

import com.example.init_java.model.User;
import com.example.init_java.repository.UserRepository;
import com.example.init_java.service.PasswordService;
import com.example.init_java.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Optional;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordService passwordService;

    @Autowired
    private JwtService jwtService;

    // POST /auth/login → autentica um usuário e retorna JWT em cookie
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user, HttpServletResponse response) {
        Map<String, Object> res = new HashMap<>();
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        
        if (existingUser.isEmpty()) {
            res.put("message", "Usuario não encontrado");
            return ResponseEntity.status(401).body(res);
        }
        
        // Verifica se a senha está correta
        if (!passwordService.matches(user.getPassword(), existingUser.get().getPassword())) {
            res.put("message", "Senha incorreta");
            return ResponseEntity.status(401).body(res);
        }
        
        // Gera o token JWT com email e id do usuário existente (do banco)
        String email = existingUser.get().getEmail();
        Long id = existingUser.get().getId();
        String name = existingUser.get().getName();
        String token = jwtService.generateToken(email, id, name);
        
        // Cria cookie com o token
        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(true); // Protege contra XSS
        cookie.setSecure(false); // true em produção com HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60); // 1 hora
        
        // Adiciona o cookie na resposta
        response.addCookie(cookie);
        res.put("message", "Login realizado com sucesso");
        res.put("name", name);
        res.put("email", email);
        return ResponseEntity.status(200).body(res);
    }

    // POST /auth/logout → remove o cookie JWT
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        // Pegar o cookie JWT da requisição
        Cookie[] cookies = request.getCookies();
        String email = null;

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    String token = cookie.getValue();
                    try {
                        email = jwtService.extractEmail(token); // extrai o email do token
                    } catch (Exception e) {
                        // token inválido
                    }
                    break;
                }
            }
        }

        // Remover o cookie
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // em produção: true
        cookie.setPath("/");
        cookie.setMaxAge(0); // remove o cookie
        response.addCookie(cookie);

        if (email != null) {
            return ResponseEntity.ok("Logout realizado com sucesso para o usuário: " + email);
        } else {
            return ResponseEntity.ok("Logout realizado com sucesso");
        }
    }

    // POST /auth/register → cria um novo usuário com senha criptografada
    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {

        Map<String, Object> res = new HashMap<>();

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            res.put("message", "email é obrigatório");
            return ResponseEntity.badRequest().body(res);
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            res.put("message", "Email já cadastrado");
            return ResponseEntity.badRequest().body(res);
        }
        // Criptografa a senha antes de salvar
        String encodedPassword = passwordService.encodePassword(user.getPassword());
        user.setPassword(encodedPassword);

        User savedUser = userRepository.save(user);
        res.put("message", "Cadastro realizado com sucesso");
        res.put("User", savedUser);
        return ResponseEntity.ok(res);
    }

    // GET /auth/validate → valida o token JWT
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@CookieValue(value = "jwt", defaultValue = "") String token) {
        Map<String, Object> res = new HashMap<>();
        if (token.isEmpty()) {
            res.put("message", "Token não encontrado");
            return ResponseEntity.status(401).body(res);
        }
        
        try {
            String email = jwtService.extractEmail(token);
            Long id = jwtService.extractId(token);
            String name = jwtService.extractName(token);
            if (jwtService.validateToken(token, email, id, name)) {
                res.put("message", "Token válido para: name: " + name + " , email: " + email + " e id: " + id);
                res.put("name", name);
                res.put("email", email);
                res.put("id", id);
                return ResponseEntity.ok(res);
            } else {
                res.put("message", "Token inválido");
                return ResponseEntity.status(401).body(res);
            }
        } catch (Exception e) {
            res.put("message", "Token inválido");
            return ResponseEntity.status(401).body(res);
        }
    }
}
