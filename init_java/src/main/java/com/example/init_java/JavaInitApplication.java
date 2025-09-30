package com.example.init_java;

import com.example.init_java.model.Contact;
import com.example.init_java.model.User;
import com.example.init_java.repository.ContactRepository;
import com.example.init_java.repository.UserRepository;
import com.example.init_java.service.PasswordService; // <- importa o serviço

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class JavaInitApplication {

    public static void main(String[] args) {
        SpringApplication.run(JavaInitApplication.class, args);
    }

    @Bean
    public CommandLineRunner loadData(ContactRepository contactRepo,
                                      UserRepository userRepo,
                                      PasswordService passwordService) { // <- injeta o serviço
        return args -> {
            // Cria o usuário com ID 1
            User user = new User();
            user.setId(1L);
            user.setName("malu");
            user.setEmail("malu@gmail.com");
            user.setPassword(passwordService.encodePassword("123")); // <- criptografa usando o mesmo serviço
            userRepo.save(user);

            // 10 contatos na Encora como Software Engineer
            contactRepo.save(new Contact("Alice Silva", "11999990001", "alice.silva@encora.com", "Encora", "Software Engineer", "Rua A, 100", user));
            contactRepo.save(new Contact("Bruno Costa", "11999990002", "bruno.costa@encora.com", "Encora", "Software Engineer", "Rua B, 101", user));
            contactRepo.save(new Contact("Carla Souza", "11999990003", "carla.souza@encora.com", "Encora", "Software Engineer", "Rua C, 102", user));
            contactRepo.save(new Contact("Daniel Pereira", "11999990004", "daniel.pereira@encora.com", "Encora", "Software Engineer", "Rua D, 103", user));
            contactRepo.save(new Contact("Elisa Fernandes", "11999990005", "elisa.fernandes@encora.com", "Encora", "Software Engineer", "Rua E, 104", user));
            contactRepo.save(new Contact("Fabio Lima", "11999990006", "fabio.lima@encora.com", "Encora", "Software Engineer", "Rua F, 105", user));
            contactRepo.save(new Contact("Gabriela Ramos", "11999990007", "gabriela.ramos@encora.com", "Encora", "Software Engineer", "Rua G, 106", user));
            contactRepo.save(new Contact("Henrique Martins", "11999990008", "henrique.martins@encora.com", "Encora", "Software Engineer", "Rua H, 107", user));
            contactRepo.save(new Contact("Isabela Almeida", "11999990009", "isabela.almeida@encora.com", "Encora", "Software Engineer", "Rua I, 108", user));
            contactRepo.save(new Contact("Joao Barbosa", "11999990010", "joao.barbosa@encora.com", "Encora", "Software Engineer", "Rua J, 109", user));

            // 10 contatos na Google como Product Manager
            contactRepo.save(new Contact("Karen Melo", "11999990011", "karen.melo@google.com", "Google", "Product Manager", "Av Google, 100", user));
            contactRepo.save(new Contact("Lucas Cunha", "11999990012", "lucas.cunha@google.com", "Google", "Product Manager", "Av Google, 101", user));
            contactRepo.save(new Contact("Mariana Vieira", "11999990013", "mariana.vieira@google.com", "Google", "Product Manager", "Av Google, 102", user));
            contactRepo.save(new Contact("Nathan Oliveira", "11999990014", "nathan.oliveira@google.com", "Google", "Product Manager", "Av Google, 103", user));
            contactRepo.save(new Contact("Olivia Santos", "11999990015", "olivia.santos@google.com", "Google", "Product Manager", "Av Google, 104", user));
            contactRepo.save(new Contact("Paulo Ferreira", "11999990016", "paulo.ferreira@google.com", "Google", "Product Manager", "Av Google, 105", user));
            contactRepo.save(new Contact("Quesia Lima", "11999990017", "quesia.lima@google.com", "Google", "Product Manager", "Av Google, 106", user));
            contactRepo.save(new Contact("Rafael Pinto", "11999990018", "rafael.pinto@google.com", "Google", "Product Manager", "Av Google, 107", user));
            contactRepo.save(new Contact("Sofia Martins", "11999990019", "sofia.martins@google.com", "Google", "Product Manager", "Av Google, 108", user));
            contactRepo.save(new Contact("Thiago Rocha", "11999990020", "thiago.rocha@google.com", "Google", "Product Manager", "Av Google, 109", user));

            // 10 contatos na Amazon como Data Analyst
            contactRepo.save(new Contact("Ana Costa", "11999990021", "ana.costa@amazon.com", "Amazon", "Data Analyst", "Av Amazon, 100", user));
            contactRepo.save(new Contact("Bruno Alves", "11999990022", "bruno.alves@amazon.com", "Amazon", "Data Analyst", "Av Amazon, 101", user));
            contactRepo.save(new Contact("Carla Lima", "11999990023", "carla.lima@amazon.com", "Amazon", "Data Analyst", "Av Amazon, 102", user));
            contactRepo.save(new Contact("Diego Nunes", "11999990024", "diego.nunes@amazon.com", "Amazon", "Data Analyst", "Av Amazon, 103", user));
            contactRepo.save(new Contact("Eliana Souza", "11999990025", "eliana.souza@amazon.com", "Amazon", "Data Analyst", "Av Amazon, 104", user));
            contactRepo.save(new Contact("Felipe Rocha", "11999990026", "felipe.rocha@amazon.com", "Amazon", "Data Analyst", "Av Amazon, 105", user));
            contactRepo.save(new Contact("Gabriela Mendes", "11999990027", "gabriela.mendes@amazon.com", "Amazon", "Data Analyst", "Av Amazon, 106", user));
            contactRepo.save(new Contact("Henrique Silva", "11999990028", "henrique.silva@amazon.com", "Amazon", "Data Analyst", "Av Amazon, 107", user));
            contactRepo.save(new Contact("Isabela Martins", "11999990029", "isabela.martins@amazon.com", "Amazon", "Data Analyst", "Av Amazon, 108", user));
            contactRepo.save(new Contact("João Pereira", "11999990030", "joao.pereira@amazon.com", "Amazon", "Data Analyst", "Av Amazon, 109", user));
        };
    }
}
