package Gestaodetarefa.demo.repository;

import Gestaodetarefa.demo.User.User;
import Gestaodetarefa.demo.model.Priority;
import Gestaodetarefa.demo.model.Status;
import Gestaodetarefa.demo.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;


import java.time.LocalDateTime;
import java.util.List;


public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);
    List<Task> findByStatus(Status status);
    List<Task> findByPriority(Priority priority);
    List<Task> findByDueDateBefore(LocalDateTime dateTime);
    List<Task> findByDueDateBetween(LocalDateTime start, LocalDateTime end);

    // Novo método para buscar tarefas por categoria
    List<Task> findByCategory(String category);
    // Novo método para buscar tarefas de um usuário por categoria
    List<Task> findByUserAndCategory(User user, String category);
}