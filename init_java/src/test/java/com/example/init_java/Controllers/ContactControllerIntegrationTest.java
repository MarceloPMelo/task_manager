package com.example.init_java.Controllers;

import com.example.init_java.model.User;
import com.example.init_java.repository.User.UserRepository;
import com.example.init_java.security.JwtService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.test.web.server.LocalServerPort;

import org.springframework.http.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class ContactControllerIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");

    @LocalServerPort
    private int port;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private JwtService jwtService;

    private User user;
    private HttpHeaders headers;

    @BeforeEach
    void setup() {

        // Cria e autentica o usuário para evitar 403
        userRepository.deleteAll();

        // Cria usuário
        user = new User();
        user.setName("teste");
        user.setEmail("teste@gmail.com");
        user.setPassword(new BCryptPasswordEncoder().encode("1234"));
        userRepository.save(user);

        // Gera JWT
        String token = jwtService.generateToken(user.getEmail(), user.getId(), user.getName());

        headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Cookie", "jwt=" + token); // envia o JWT como cookie
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

        HttpEntity<String> request = new HttpEntity<>(contactJson, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://localhost:" + port + "/contacts",
                request,
                String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        var json = new ObjectMapper().readTree(response.getBody());
        assertThat(json.at("/contact/name").asText()).isEqualTo("Joao abreu");
        assertThat(json.at("/contact/userId").asLong()).isEqualTo(user.getId());
    }
}
