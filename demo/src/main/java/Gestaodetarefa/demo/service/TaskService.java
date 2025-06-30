package Gestaodetarefa.demo.service;


import Gestaodetarefa.demo.User.User;
import Gestaodetarefa.demo.model.Priority;
import Gestaodetarefa.demo.model.Status;
import Gestaodetarefa.demo.model.Task;
import Gestaodetarefa.demo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
public class TaskService {

    @Autowired
    private TaskRepository repository;

    public Task create(Task task) {
        task.setStatus(Status.A_FAZER); // Define status padrão
        return repository.save(task);
    }

    public List<Task> findAllByUser(User user) {
        return repository.findByUser(user);
    }
    public List<Task> findAll() {
        return repository.findAll();
    }

    public Optional<Task> findBbyId(Long id) {
        return repository.findById(id);
    }

    public List<Task> findByStatus(Status status) {
        return repository.findByStatus(status);
    }

    public List<Task> filterByPriority(Priority priority) {
        return repository.findByPriority(priority);
    }

    // Novo método para buscar tarefas por categoria para todos os usuários (útil para admins, por exemplo)
    public List<Task> findByCategory(String category) {
        return repository.findByCategory(category);
    }

    // Novo método para buscar tarefas de um usuário específico por categoria
    public List<Task> findTasksByUserAndCategory(User user, String category) {
        return repository.findByUserAndCategory(user, category);
    }


    public List<Task> dueSoon() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime in24h = now.plusHours(24);
        return repository.findByDueDateBetween(now, in24h);
    }

    public List<Task> overdue() {
        return repository.findByDueDateBefore(LocalDateTime.now());
    }


    public Task update(Long id, Task taskAtualizado) {

        Optional<Task> opt = repository.findById(id);

        if (opt.isPresent()) {

            Task existente = opt.get();

            existente.setTitle(taskAtualizado.getTitle());
            existente.setDescription(taskAtualizado.getDescription());
            existente.setDueDate(taskAtualizado.getDueDate());
            existente.setPriority(taskAtualizado.getPriority());
            existente.setStatus(taskAtualizado.getStatus());
            existente.setValue(taskAtualizado.getValue());
            existente.setCurrency(taskAtualizado.getCurrency());
            existente.setCategory(taskAtualizado.getCategory());

            return repository.save(existente);
    } else {
            throw new RuntimeException("Tarefa com id " + id + "não encontrada.");
        }
    }
    public void delete (Long id) {
        repository.deleteById(id);
    }
}
