package com.example.init_java.security;

import com.example.init_java.model.User;
import com.example.init_java.repository.User.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Carrega um usuário a partir do email (username no contexto do Spring Security).
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));

        // Retorna um UserDetails padrão do Spring Security
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())     // identifica o usuário pelo email
                .password(user.getPassword())      // senha já criptografada no banco
                .roles("USER")                     // papel padrão (você pode personalizar)
                .build();
    }
}
