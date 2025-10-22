package com.example.init_java.controller;

import com.example.init_java.dto.CreateContactResponse;
import com.example.init_java.dto.PaginatedContactsResponse;
import com.example.init_java.model.Contact;
import com.example.init_java.model.User;
import com.example.init_java.repository.Contact.ContactRepository;
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

    private String BASE_URL = "http://localhost:";

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");

    @LocalServerPort
    private int port;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContactRepository contactRepository;

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
                BASE_URL + port + "/contacts",
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
                BASE_URL + port + "/contacts",
                request0,
                String.class);

        HttpEntity<String> request = new HttpEntity<>(firstEmailJson, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(
                BASE_URL + port + "/contacts",
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

        // headers sem o cookie de autenticação
        HttpHeaders unauthenticatedHeaders = new HttpHeaders();
        unauthenticatedHeaders.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> request = new HttpEntity<>(contactJson, unauthenticatedHeaders);

        ResponseEntity<String> response = restTemplate.postForEntity(
                BASE_URL + port + "/contacts",
                request,
                String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    // GET contacts
    @Test
    void shouldReturnContactsSuccessfully() {
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        ResponseEntity<PaginatedContactsResponse> response = restTemplate.exchange(BASE_URL + port + "/contacts",
                HttpMethod.GET, requestEntity, PaginatedContactsResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
    }

    @Test
    void shouldReturnBadRequestWhenDuplicateUniqueParams() throws Exception {

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(
                BASE_URL + port + "/contacts?sortBy=company&sortBy=company", HttpMethod.GET, requestEntity,
                String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();

        var json = objectMapper.readTree(response.getBody());
        assertThat(json.at("/message").asText())
                .isEqualTo("O parâmetro 'sortBy' não pode ser enviado mais de uma vez.");

    }

    @Test
    void shouldReturnBadRequestWhenInvalidSortByParam() throws Exception {

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(BASE_URL + port + "/contacts?sortBy=apple",
                HttpMethod.GET, requestEntity, String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();

        var json = objectMapper.readTree(response.getBody());
        assertThat(json.at("/message").asText()).isEqualTo("Campo inválido para ordenação: apple");

    }

    // DELETE contacts

    @Test
    void shouldDeleteContactsSuccessfully() throws Exception {

        Contact contactToDelete = new Contact();
        contactToDelete.setName("Contato a ser Deletado");
        contactToDelete.setEmail("deletar@email.com");
        contactToDelete.setAddress("Endereco");
        contactToDelete.setCompany("Company");
        contactToDelete.setJobTitle("Job Title");
        contactToDelete.setPhone("+55 71 95555-4444");
        contactToDelete.setUser(user); // Associa ao usuário criado no @BeforeEach
        Contact savedContact = contactRepository.save(contactToDelete);
        Long contactId = savedContact.getId();

        // Verifica se o contato foi salvo
        assertThat(contactRepository.findById(contactId)).isNotEmpty();

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(BASE_URL + port + "/contacts/" + contactId, HttpMethod.DELETE,
                requestEntity, String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();

        var json = objectMapper.readTree(response.getBody());
        assertThat(json.at("/message").asText()).isEqualTo("Contato deletado com sucesso");

        //Verifica remoção
        assertThat(contactRepository.findById(contactId)).isEmpty();
    }

    @Test
    void shouldReturnNotFoundWhenContactDoesNotExist() throws Exception {

        Long contactId = 999L; 
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(BASE_URL + port + "/contacts/" + contactId, HttpMethod.DELETE,
                requestEntity, String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();

        var json = objectMapper.readTree(response.getBody());
        assertThat(json.at("/message").asText()).isEqualTo("Contato não encontrado");
    }

    @Test
    void shouldReturnNotFoundWhenUserTriesToDeleteAnotherUsersContact() throws Exception {
        
        // Cria o usuário dono do contato
        User userOwner = new User();
        userOwner.setName("Dono do Contato");
        userOwner.setEmail("dono.contato@email.com");
        userOwner.setPassword(passwordEncoder.encode("senha456"));
        userRepository.save(userOwner);

        // Cria um contato que pertence ao userOwner
        Contact contactOfOwner = new Contact();
        contactOfOwner.setName("Contato do Dono");
        contactOfOwner.setEmail("contato.dono@email.com");
        contactOfOwner.setAddress("Endereco");
        contactOfOwner.setCompany("Company");
        contactOfOwner.setJobTitle("Job Title");
        contactOfOwner.setPhone("+55 71 98888-7777");
        contactOfOwner.setUser(userOwner);
        Contact savedContact = contactRepository.save(contactOfOwner);
        Long contactId = savedContact.getId();

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange( //Tenta deletar o contato logado como user do @BeforeEach
                BASE_URL + port + "/contacts/" + contactId,
                HttpMethod.DELETE,
                requestEntity,
                String.class
        );
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(contactRepository.findById(contactId)).isNotEmpty(); // Verifica que o contato não foi deletado
        var json = objectMapper.readTree(response.getBody());
        assertThat(json.at("/message").asText()).isEqualTo("Contato não pertence a usuário");
    }

}
