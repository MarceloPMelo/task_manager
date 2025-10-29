package com.example.init_java.controller;

import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.init_java.dto.LoginResponse;
import com.example.init_java.model.User;
import com.example.init_java.repository.User.UserRepository;
import com.example.init_java.security.JwtService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
public class AuthControllerIntegrationTest {

    private String BASE_URL = "http://localhost:";

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private User user;
    private HttpHeaders headers;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @BeforeEach
    void setup() {

        userRepository.deleteAll();

        // Cria usuário
        user = new User();
        user.setName("teste");
        user.setEmail("teste@gmail.com");
        user.setPassword(passwordEncoder.encode("1234"));
        userRepository.save(user);

        headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
    }

    @Test
    void shouldLoginSuccessfully() throws Exception {
        String loginJason = """
                    {
                      "email": "teste@gmail.com",
                      "password": "1234"
                    }
                """;

        HttpEntity<String> request = new HttpEntity<>(loginJason, headers);
        ResponseEntity<LoginResponse> response = restTemplate.postForEntity(
                BASE_URL + port + "/auth/login",
                request,
                LoginResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isEqualTo("Login realizado com sucesso");
        assertThat(response.getBody().getEmail()).isEqualTo("teste@gmail.com");
        assertThat(response.getBody().getName()).isEqualTo("teste");

        List<String> cookies = response.getHeaders().get("Set-Cookie");
        assertThat(cookies).isNotEmpty();

    }


}
