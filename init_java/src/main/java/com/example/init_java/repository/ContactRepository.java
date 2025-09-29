package com.example.init_java.repository;

import com.example.init_java.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    // Lista todos os contatos de um usuário específico
    List<Contact> findByUser_Id(Long userId);
    Page<Contact> findByUser_Id(Long userId, Pageable pageable);
    boolean existsByEmail(String email);
}
