package com.example.init_java.service;

import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.init_java.exceptions.InvalidPasswordException;
import com.example.init_java.exceptions.UserNotFoundException;
import com.example.init_java.model.User;
import com.example.init_java.repository.User.UserRepository;
import com.example.init_java.security.JwtService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private PasswordService passwordService;

    @InjectMocks
    private AuthService authService;
    
    // Testes para o método login()
    @Test
    void shouldReturnMessageWhenLoginIsSuccessful() {
        // Arrange
        User user = new User();
        user.setEmail("teste@email.com");
        user.setPassword("senha123"); // senha em texto
        user.setId(1L);
        user.setName("Test User");

        HttpServletResponse response = mock(HttpServletResponse.class);

        when(userRepository.findByEmail("teste@email.com")).thenReturn(Optional.of(user));
        when(passwordService.matches("senha123", "senha123")).thenReturn(true);
        when(jwtService.generateToken(user.getEmail(), user.getId(), user.getName()))
                .thenReturn("fake-token");

        // Act
        Map<String, Object> result = authService.login(user, response);

        // Assert
        assertEquals("Login realizado com sucesso", result.get("message"));
        assertEquals("Test User", result.get("name"));
        assertEquals("teste@email.com", result.get("email"));

        // Verifica se os mocks foram chamados corretamente
        verify(userRepository).findByEmail("teste@email.com");
        verify(passwordService).matches("senha123", "senha123");
        verify(jwtService).generateToken(user.getEmail(), user.getId(), user.getName());

        // Verifica se cookie foi adicionado
        verify(response).addCookie(any(Cookie.class));
    }

    @Test
    void shouldThrowUserNotFoundExceptionWhenEmailDoesNotExist() {
        // Arrange
        User user = new User();
        user.setEmail("teste@email.com");
        user.setPassword("senha123"); // senha em texto
        user.setId(1L);
        user.setName("Test User");

        HttpServletResponse response = mock(HttpServletResponse.class);

        // Mock do repositório: retorna Optional vazio simulando usuário não encontrado
        when(userRepository.findByEmail("teste@email.com")).thenReturn(Optional.empty());

        // Act & Assert: verifica se a exceção é lançada
        assertThrows(UserNotFoundException.class, () -> {
            authService.login(user, response);
        });

        // Verifica que o repositório foi chamado corretamente
        verify(userRepository).findByEmail("teste@email.com");

        // Como a exceção é lançada, nenhum cookie deve ser adicionado
        verify(response, never()).addCookie(any(Cookie.class));
    }

    @Test
    void shouldThrowInvalidPasswordExceptionWhenIncorrectPassword() {

        // Arrange
        User user = new User();
        user.setEmail("teste@email.com");
        user.setPassword("senha123"); // senha em texto
        user.setId(1L);
        user.setName("Test User");

        HttpServletResponse response = mock(HttpServletResponse.class);

        when(userRepository.findByEmail("teste@email.com")).thenReturn(Optional.of(user));
        when(passwordService.matches("senha123", "senha123")).thenReturn(false);

        // Act & Assert: verifica se a exceção é lançada
        assertThrows(InvalidPasswordException.class, () -> {
            authService.login(user, response);
        });

        verify(userRepository).findByEmail("teste@email.com");
        verify(passwordService).matches("senha123", "senha123");
        verify(response, never()).addCookie(any(Cookie.class));
    }


    // Testes para o método logout()

}


//@Mock simula dependências externas (UserRepository, JwtService, PasswordService).
//@InjectMocks cria a classe real (AuthService) com os mocks injetados.
//when(...).thenReturn(...) define o comportamento dos mocks.
//login(...) é chamado com dados de teste.
//assertEquals ou assertThrows verifica o resultado esperado.
//verify(...) garante que os mocks foram chamados corretamente, confirmando o fluxo interno do método.