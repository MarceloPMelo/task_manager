package com.example.init_java.Controllers;

import com.example.init_java.dto.CreateContactResponse;
import com.example.init_java.dto.PaginatedContactsResponse;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import com.fasterxml.jackson.databind.ObjectMapper;

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

    @Autowired
    private ObjectMapper objectMapper;

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

    @Test
    void shouldReturnBadRequestWhenNameIsMissing() {
        String contactJsonWithNoName = """
                {
                  "phone": "+55 71 95555-4444",
                  "email": "sem.nome@email.com"
                }
                """;

        HttpEntity<String> request = new HttpEntity<>(contactJsonWithNoName, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://localhost:" + port + "/contacts",
                request,
                String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void shouldReturnBadRequestWhenDuplicateEmail() throws Exception {

        String firstEmailJson = """
                {
                      "name": "Joao abreu",
                      "phone": "+55 71 95555-4444",
                      "email": "joao.abrefu@email.com",
                      "company": "Marketing Plus",
                      "jobTitle": "Especialista em Marketing",
                      "address": "Av. Sete de Setembro, 150 - Salvador/BA"
                }
                """;

        HttpEntity<String> request0 = new HttpEntity<>(firstEmailJson, headers);
        restTemplate.postForEntity(
                "http://localhost:" + port + "/contacts",
                request0,
                String.class);

        HttpEntity<String> request = new HttpEntity<>(firstEmailJson, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://localhost:" + port + "/contacts",
                request,
                String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        var json = objectMapper.readTree(response.getBody());
        assertThat(json.at("/message").asText()).isEqualTo("Email já cadastrado");

    }

    @Test
    void shouldReturn403WhenNotAuthenticated() {
        String contactJson = """
                {
                  "name": "Usuario Fantasma",
                  "phone": "+55 71 91111-2222",
                  "email": "fantasma@email.com"
                }
                """;

        //headers sem o cookie de autenticação
        HttpHeaders unauthenticatedHeaders = new HttpHeaders();
        unauthenticatedHeaders.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> request = new HttpEntity<>(contactJson, unauthenticatedHeaders);

        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://localhost:" + port + "/contacts",
                request,
                String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }



    //GET contacts
    @Test
    void shouldReturnContactsSuccessfully() {
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        ResponseEntity<PaginatedContactsResponse> response = restTemplate.exchange("http://localhost:" + port + "/contacts", HttpMethod.GET, requestEntity, PaginatedContactsResponse.class );
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
    }


    @Test
    void shouldReturnBadRequestWhenDuplicateUniqueParams () throws Exception {

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange("http://localhost:" + port + "/contacts?sortBy=company&sortBy=company", HttpMethod.GET , requestEntity, String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();

        var json = objectMapper.readTree(response.getBody());
        assertThat(json.at("/message").asText()).isEqualTo("O parâmetro 'sortBy' não pode ser enviado mais de uma vez.");

    }

    @Test
    void shouldReturnBadRequestWhenInvalidSortByParam () throws Exception {

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange("http://localhost:" + port + "/contacts?sortBy=apple", HttpMethod.GET, requestEntity, String.class);
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();

        var json = objectMapper.readTree(response.getBody());
        assertThat(json.at("/message").asText()).isEqualTo("Campo inválido para ordenação: apple");

    }


}
