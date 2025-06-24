package Gestaodetarefa.demo.TaskController;

import Gestaodetarefa.demo.model.Priority;
import Gestaodetarefa.demo.model.Status;
import Gestaodetarefa.demo.model.Task;
import Gestaodetarefa.demo.User.User; // Importação necessária
import Gestaodetarefa.demo.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // Importação necessária
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;

import java.util.List;

@RestController
@RequestMapping("api/tasks")
public class TaskController {

    @Autowired
    private TaskService service;

    @PostMapping
    public ResponseEntity<Task> create(@RequestBody Task task, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        task.setUser(currentUser);
        Task created = service.create(task);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<Task>> all(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        List<Task> tasks = service.findAllByUser(currentUser);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> findbyId(@PathVariable Long id) {
        return service.findBbyId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable Long id, @RequestBody Task taskAtualizada) {
        try {
            Task updated = service.update(id, taskAtualizada);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Task>> findByStatus(@PathVariable Status status) {
        return ResponseEntity.ok(service.findByStatus(status));
    }
    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<Task>> filterByPriority(@PathVariable Priority priority) {
        return ResponseEntity.ok(service.filterByPriority(priority));
    }
    // Novo endpoint para filtrar tarefas de um usuário por categoria
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Task>> findByCategory(@PathVariable String category, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        List<Task> tasks = service.findTasksByUserAndCategory(currentUser, category);
        return ResponseEntity.ok(tasks);
    }
    @GetMapping("/due-soon")
    public ResponseEntity<List<Task>> dueSoon() {
        return ResponseEntity.ok(service.dueSoon());
    }
    @GetMapping("/overdue")
    public ResponseEntity<List<Task>> overdue() {
        return ResponseEntity.ok(service.overdue());
    }

    @GetMapping("/web/tasks")
    public String showTasks(Model model, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        List<Task> tasks = service.findAllByUser(currentUser);

        model.addAttribute("tasks", tasks);

        return "tasks-list";
    }
    @GetMapping("/tasks") // Rota web principal
    public String viewTasks(Model model, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        List<Task> tasks = service.findAllByUser(currentUser);
        model.addAttribute("tasks", tasks);
        return "task-list";
    }
}