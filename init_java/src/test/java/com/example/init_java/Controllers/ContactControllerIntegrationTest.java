package com.example.init_java.Controllers;

import com.example.init_java.model.User;
import com.example.init_java.repository.User.UserRepository;
import com.example.init_java.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import jakarta.servlet.http.Cookie;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class ContactControllerIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    private User user;
    private Cookie jwtCookie;

    @BeforeEach
    void setup() {

        //Cria e autentica o usuário para evitar 403
        userRepository.deleteAll();

        user = new User();
        user.setName("teste");
        user.setEmail("teste@gmail.com");
        user.setPassword(new BCryptPasswordEncoder().encode("1234"));
        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail(), user.getId(), user.getName());
        jwtCookie = new Cookie("jwt", token);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setPath("/");
    }

    @Test
    void shouldPostContact() throws Exception {
        String contactJson = """
                {
                  "name": "Joao abreu",
                  "phone": "+55 71 95555-4444",
                  "email": "joao.abrefu@email.com",
                  "company": "Marketing Plus",
                  "jobTitle": "Especialista em Marketing",
                  "address": "Av. Sete de Setembro, 150 - Salvador/BA"
                }
            """;

        mockMvc.perform(post("/contacts")
                .cookie(jwtCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(contactJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.contact.name").value("Joao abreu"))
                .andExpect(jsonPath("$.contact.userId").value(user.getId().intValue()));
    }
}
