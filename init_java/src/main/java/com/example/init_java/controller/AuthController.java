package com.example.init_java.controller;

import com.example.init_java.exceptions.InvalidPasswordException;
import com.example.init_java.exceptions.InvalidTokenException;
import com.example.init_java.exceptions.UserNotFoundException;
import com.example.init_java.exceptions.BadRequestException;

import com.example.init_java.model.User;
import com.example.init_java.repository.UserRepository;
import com.example.init_java.security.JwtService;
import com.example.init_java.service.PasswordService;
import jakarta.validation.Valid;

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

    private final UserRepository userRepository;
    private final PasswordService passwordService;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository, PasswordService passwordService, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.jwtService = jwtService;
    }

    // POST /auth/login → autentica um usuário e retorna JWT em cookie
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user, HttpServletResponse response) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        // Lança exceção se o usuário não for encontrado
        if (existingUser.isEmpty()) {
            throw new UserNotFoundException();
        }

        // Lança exceção se a senha estiver incorreta
        if (!passwordService.matches(user.getPassword(), existingUser.get().getPassword())) {
            throw new InvalidPasswordException();
        }

        // Gera o token JWT
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
        response.addCookie(cookie);

        // Retorna resposta de sucesso
        Map<String, Object> res = new HashMap<>();
        res.put("message", "Login realizado com sucesso");
        res.put("name", name);
        res.put("email", email);
        return ResponseEntity.ok(res);
    }

    // POST /auth/logout → remove o cookie JWT
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletRequest request, HttpServletResponse response) {
        String email = null;
        Cookie[] cookies = request.getCookies();

        // Verifica se existe cookie JWT
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    String token = cookie.getValue();
                    // Tenta extrair o email do token
                    email = jwtService.extractEmail(token);
                    break;
                }
            }
        }

        if (email == null) {
            throw new InvalidTokenException("Token inválido ou expirado");
        }

        // Remove o cookie (mesmo que não tenha encontrado email)
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // true em produção
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        // Retorna sucesso somente se o token era válido
        Map<String, Object> res = new HashMap<>();
        res.put("message", "Logout realizado com sucesso para o usuário: " + email);
        return ResponseEntity.ok(res);
    }

    // POST /auth/register → cria um novo usuário com senha criptografada
    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody User user) {

        // Se chegar aqui, o Spring já validou os campos obrigatórios

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new BadRequestException("Email já cadastrado");
        }

        // Criptografa a senha antes de salvar
        String encodedPassword = passwordService.encodePassword(user.getPassword());
        user.setPassword(encodedPassword);

        User savedUser = userRepository.save(user);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Cadastro realizado com sucesso");
        res.put("user", savedUser);
        return ResponseEntity.ok(res);
    }

    // GET /auth/validate → valida o token JWT
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(
            @CookieValue(value = "jwt", defaultValue = "") String token) {

        if (token.isEmpty()) {
            throw new InvalidTokenException("Token não encontrado");
        }

        try {
            String email = jwtService.extractEmail(token);
            Long id = jwtService.extractId(token);
            String name = jwtService.extractName(token);

            if (!jwtService.validateToken(token, email, id, name)) {
                throw new InvalidTokenException("Token inválido");
            }

            Map<String, Object> res = new HashMap<>();
            res.put("message", "Token válido para: name: " + name + " , email: " + email + " e id: " + id);
            res.put("name", name);
            res.put("email", email);
            res.put("id", id);
            return ResponseEntity.ok(res);

        } catch (Exception e) {
            throw new InvalidTokenException("Token inválido ou expirado");
        }
    }
}
