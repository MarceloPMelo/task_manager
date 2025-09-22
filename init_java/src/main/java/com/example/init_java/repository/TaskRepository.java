package com.example.init_java.repository;

import com.example.init_java.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TaskRepository extends JpaRepository<Task, Long> {
    // Lista todas as tasks de um usuário específico
    List<Task> findByUser_Id(Long userId);
    Page<Task> findByUser_Id(Long userId, Pageable pageable);
}
