package com.example.init_java.config;

import com.example.init_java.service.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import java.io.PrintWriter;
import org.springframework.lang.NonNull;

@Component
public class JwtInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtService jwtService;

    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler) throws Exception {
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        
        // Permite acesso às rotas de auth e POST /users (criação de usuário)
        if (requestURI.startsWith("/auth/")) {
            return true;
        }
        
        // Permite requisições OPTIONS (CORS preflight)
        if ("OPTIONS".equals(method)) {
            return true;
        }

        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            sendUnauthorizedResponse(response, "Token não encontrado. Faça login para acessar esta rota.");
            return false;
        }

        String token = null;
        for (Cookie cookie : cookies) {
            if ("jwt".equals(cookie.getName())) {
                token = cookie.getValue();
                break;
            }
        }

        if (token == null) {
            sendUnauthorizedResponse(response, "Token não encontrado. Faça login para acessar esta rota.");
            return false;
        }

        try {
            String email = jwtService.extractEmail(token);
            Long id = jwtService.extractId(token);
            if (jwtService.validateToken(token, email, id)) {
                request.setAttribute("userEmail", email);
                request.setAttribute("userId", id);
                return true;
            }
        } catch (Exception e) {
            // Token inválido
        }

        sendUnauthorizedResponse(response, "Token inválido ou expirado. Faça login novamente.");
        return false;
    }

    private void sendUnauthorizedResponse(HttpServletResponse response, String message) throws Exception {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String jsonResponse = String.format(
            "{\"error\": \"Unauthorized\", \"message\": \"%s\", \"status\": 401}", 
            message
        );
        
        PrintWriter writer = response.getWriter();
        writer.write(jsonResponse);
        writer.flush();
    }
} 