package com.example.init_java.repository;

import com.example.init_java.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ContactRepository extends JpaRepository<Contact, Long>, JpaSpecificationExecutor<Contact> {

    // Lista todos os contatos de um usuário específico
    List<Contact> findByUser_Id(Long userId);

    // Lista contatos paginados de um usuário específico
    Page<Contact> findByUser_Id(Long userId, Pageable pageable);

    // Verifica se já existe um contato com determinado email
    boolean existsByEmail(String email);

    @Query("SELECT DISTINCT c.company FROM Contact c")
    List<String> findDistinctCompanies();

    @Query("SELECT DISTINCT c.jobTitle FROM Contact c")
    List<String> findDistinctJobTitles();
}
