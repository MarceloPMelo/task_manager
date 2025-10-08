package com.example.init_java.service;

import com.example.init_java.exceptions.InvalidPasswordException;
import com.example.init_java.exceptions.InvalidTokenException;
import com.example.init_java.exceptions.UserNotFoundException;
import com.example.init_java.exceptions.BadRequestException;

import com.example.init_java.model.User;
import com.example.init_java.repository.User.UserRepository;
import com.example.init_java.security.JwtService;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordService passwordService;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordService passwordService, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.jwtService = jwtService;
    }

    public Map<String, Object> login(User user, HttpServletResponse response) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isEmpty()) {
            throw new UserNotFoundException();
        }

        if (!passwordService.matches(user.getPassword(), existingUser.get().getPassword())) {
            throw new InvalidPasswordException();
        }

        String email = existingUser.get().getEmail();
        Long id = existingUser.get().getId();
        String name = existingUser.get().getName();
        String token = jwtService.generateToken(email, id, name);

        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60); // 1 hora
        response.addCookie(cookie);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Login realizado com sucesso");
        res.put("name", name);
        res.put("email", email);
        return res;
    }

    public Map<String, Object> logout(HttpServletRequest request, HttpServletResponse response) {
        String email = null;
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    String token = cookie.getValue();
                    email = jwtService.extractEmail(token);
                    break;
                }
            }
        }

        if (email == null) {
            throw new InvalidTokenException("Token inválido ou expirado");
        }

        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Logout realizado com sucesso para o usuário: " + email);
        return res;
    }

    public Map<String, Object> register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new BadRequestException("Email já cadastrado");
        }

        String encodedPassword = passwordService.encodePassword(user.getPassword());
        user.setPassword(encodedPassword);

        User savedUser = userRepository.save(user);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Cadastro realizado com sucesso");
        res.put("user", savedUser);
        return res;
    }

    public Map<String, Object> validateToken(String token) {
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
            return res;

        } catch (Exception e) {
            throw new InvalidTokenException("Token inválido ou expirado");
        }
    }
}
