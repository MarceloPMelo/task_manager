package com.example.init_java.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;

import static org.mockito.ArgumentMatchers.anyLong;

import static org.mockito.Mockito.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.example.init_java.dto.ContactDto;
import com.example.init_java.exceptions.BadRequestException;
import com.example.init_java.model.Contact;
import com.example.init_java.model.User;
import com.example.init_java.repository.Contact.ContactRepository;
import com.example.init_java.repository.User.UserRepository;
import com.example.init_java.security.JwtService;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

import org.springframework.data.domain.Sort;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ContactRepository contactRepository;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private ContactService contactService;

    private final Long FAKE_USER_ID = 99L;


    //POST /contacts
    @Test
    void shouldReturnMessageWhenCreateContactIsSuccessful() {
        // Arrange
        Contact contact = new Contact();
        contact.setEmail("test@example.com");
        contact.setName("Test Contact");
        contact.setPhone("1234567890");
        contact.setCompany("Test Company");
        contact.setJobTitle("Tester");

        User user = new User();
        user.setId(FAKE_USER_ID);

        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);

        when(authentication.getPrincipal()).thenReturn(user.getId());
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        // Mocks do repositório
        when(contactRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(userRepository.findById(FAKE_USER_ID)).thenReturn(Optional.of(user));

        Contact savedContact = new Contact();
        savedContact.setId(1L);
        savedContact.setEmail(contact.getEmail());
        savedContact.setName(contact.getName());
        savedContact.setPhone(contact.getPhone());
        savedContact.setCompany(contact.getCompany());
        savedContact.setJobTitle(contact.getJobTitle());
        savedContact.setUser(user);

        when(contactRepository.save(any(Contact.class))).thenReturn(savedContact);

        // Act
        Map<String, Object> result = contactService.createContact(contact);

        // Assert
        assertEquals("Contato criado com sucesso", result.get("message"));

        ContactDto contactDto = (ContactDto) result.get("contact");
        assertEquals(1L, contactDto.getId());
        assertEquals("Test Contact", contactDto.getName());
        assertEquals("test@example.com", contactDto.getEmail());
        assertEquals("1234567890", contactDto.getPhone());
        assertEquals("Test Company", contactDto.getCompany());
        assertEquals("Tester", contactDto.getJobTitle());

        // Verifica se os métodos do repositório foram chamados corretamente
        verify(contactRepository).existsByEmail("test@example.com");
        verify(userRepository).findById(FAKE_USER_ID);
        verify(contactRepository).save(any(Contact.class));
    }

    @Test
    void shouldThrowBadRequestException_WhenEmailAlreadyExists() {
        // Arrange
        Contact contact = new Contact();
        contact.setEmail("existing@example.com");

        User user = new User();
        user.setId(FAKE_USER_ID);

        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);

        when(authentication.getPrincipal()).thenReturn(user.getId());
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        

        // Configura o mock para simular que o email já existe
        when(contactRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // Act & Assert
        // Verifica se a exceção esperada é lançada
        BadRequestException exception = assertThrows(BadRequestException.class, () -> {
            contactService.createContact(contact);
        });

        // Verifica a mensagem da exceção
        assertEquals("Email já cadastrado", exception.getMessage());

        // Garante que a lógica parou e não tentou salvar ou buscar o usuário
        verify(userRepository, never()).findById(anyLong());
        verify(contactRepository, never()).save(any(Contact.class));
    }

    @Test
    void shouldThrowBadRequestException_WhenUserIsNotFound() {
        // Arrange
        Contact contact = new Contact();
        contact.setEmail("new@example.com");

        // Configura os mocks
        User user = new User();
        user.setId(FAKE_USER_ID);

        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);

        when(authentication.getPrincipal()).thenReturn(user.getId());

        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        when(contactRepository.existsByEmail("new@example.com")).thenReturn(false);

        // Simula que o usuário não foi encontrado
        when(userRepository.findById(FAKE_USER_ID)).thenReturn(Optional.empty());

        // Act & Assert
        BadRequestException exception = assertThrows(BadRequestException.class, () -> {
            contactService.createContact(contact);
        });

        assertEquals("Usuário não encontrado", exception.getMessage());

        // Garante que o método de salvar nunca foi chamado
        verify(contactRepository, never()).save(any(Contact.class));
    }



    //GET /contacts
    @Test
    void shouldReturnContactsSuccessfully() {
        // 🔹 Criamos um spy local (só vale pra este teste)
        ContactService spyService = Mockito.spy(contactService);

        // Arrange
        int page = 0;
        int size = 10;
        String search = "John";
        List<String> company = List.of("Google");
        List<String> jobTitle = List.of("Developer");
        String sortBy = "name";
        String direction = "asc";
        MultiValueMap<String, String> allParams = new LinkedMultiValueMap<>();


        // Configura o mock para simular a extração do id do usuário do Security Context
    
        User user = new User();
        user.setId(FAKE_USER_ID);
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(authentication.getPrincipal()).thenReturn(user.getId());
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        // Mocks de métodos internos
        doNothing().when(spyService).validateUniqueParams(allParams);
        doNothing().when(spyService).validateSortBy(sortBy);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, sortBy));
        when(spyService.buildPageable(page, size, sortBy, direction)).thenReturn(pageable);

        Specification<Contact> spec = (root, query, cb) -> null;
        when(spyService.buildSpecification(user.getId(), search, company, jobTitle)).thenReturn(spec);

        // Mock do repositório
        Contact contact = new Contact();
        contact.setName("John Doe");
        contact.setPhone("81999999999");
        contact.setEmail("johnDoe@gmail.com");
        contact.setJobTitle("Tester");
        contact.setCompany("Google");
        contact.setAddress("123 Main St");
        Page<Contact> contactPage = new PageImpl<>(List.of(contact), pageable, 1);
        when(contactRepository.findAll(spec, pageable)).thenReturn(contactPage);

        // Mock do método final de formatação
        Map<String, Object> expectedResponse = Map.of("contacts", List.of("contact-dto"));
        doReturn(expectedResponse).when(spyService).formatResponse(contactPage, sortBy, direction);

        // Act
        Map<String, Object> response = spyService.getContacts(page, size, search, company, jobTitle, sortBy, direction, allParams);

        // Assert
        assertEquals(expectedResponse, response);

        // Verificações
        verify(spyService).validateUniqueParams(allParams);
        verify(spyService).validateSortBy(sortBy);
        verify(spyService).buildPageable(page, size, sortBy, direction);
        verify(spyService).buildSpecification(user.getId(), search, company, jobTitle);
        verify(contactRepository).findAll(spec, pageable);
        verify(spyService).formatResponse(contactPage, sortBy, direction);
    }
}
