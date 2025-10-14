package com.example.init_java.Controllers;

import com.example.init_java.dto.CreateContactResponse;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

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

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setup() {

        // Cria e autentica o usuário para evitar 403
        userRepository.deleteAll();

        // Cria usuário
        user = new User();
        user.setName("teste");
        user.setEmail("teste@gmail.com");
        user.setPassword(passwordEncoder.encode("1234"));
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

        ResponseEntity<CreateContactResponse> response = restTemplate.postForEntity(
                "http://localhost:" + port + "/contacts",
                request,
                CreateContactResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isEqualTo("Contato criado com sucesso");
        assertThat(response.getBody().getContact().getName()).isEqualTo("Joao abreu");
        assertThat(response.getBody().getContact().getUserId()).isEqualTo(user.getId());
    }
}
