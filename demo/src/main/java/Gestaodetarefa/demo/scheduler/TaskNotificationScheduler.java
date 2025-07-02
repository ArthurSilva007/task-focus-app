package Gestaodetarefa.demo.scheduler;

// --- IMPORTS CORRIGIDOS ---
import Gestaodetarefa.demo.User.User; // A linha que faltava
import Gestaodetarefa.demo.email.EMAILSEVICE.EmailService;
import Gestaodetarefa.demo.model.Status;
import Gestaodetarefa.demo.model.Task;
import Gestaodetarefa.demo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class TaskNotificationScheduler {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private EmailService emailService;

    // Roda a cada minuto
    @Scheduled(cron = "0 * * * * *")
    public void verificarTarefasEEnviarNotificacoes() {
        System.out.println("Executando verificação de tarefas agendadas... " + LocalDateTime.now());

        // 1. Pega todas as tarefas que não estão concluídas
        List<Task> tarefasNaoConcluidas = taskRepository.findByStatusNot(Status.CONCLUIDO);

        // 2. Filtra apenas as que estão atrasadas (venceram antes de agora)
        List<Task> tarefasAtrasadas = tarefasNaoConcluidas.stream()
                .filter(task -> task.getDueDate() != null && task.getDueDate().isBefore(LocalDateTime.now()))
                .collect(Collectors.toList());

        if (tarefasAtrasadas.isEmpty()) {
            System.out.println(">>> Nenhuma tarefa atrasada encontrada.");
            return;
        }

        System.out.println(">>> Detectadas " + tarefasAtrasadas.size() + " tarefas atrasadas. Enviando e-mails...");

        for (Task task : tarefasAtrasadas) {
            // O código agora vai funcionar, pois ele sabe o que é um "User"
            if (task.getUser() == null || task.getUser().getEmail() == null) {
                continue;
            }

            User user = task.getUser();
            String userEmail = user.getEmail();
            String userFirstName = user.getFirstname();

            String subject = "Alerta: Tarefa Atrasada - " + task.getTitle();
            String text = String.format(
                    "Olá, %s.\n\nA sua tarefa \"%s\" está atrasada!\n\n" +
                            "Data de Vencimento: %s\n" +
                            "Prioridade: %s\n\n" +
                            "Acesse o TaskFocus para atualizá-la.",
                    userFirstName,
                    task.getTitle(),
                    task.getDueDate().toString(),
                    task.getPriority()
            );
            emailService.sendNotificationEmail(userEmail, subject, text);
        }
    }
}