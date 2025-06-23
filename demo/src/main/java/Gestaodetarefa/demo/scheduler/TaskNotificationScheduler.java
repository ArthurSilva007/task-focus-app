package Gestaodetarefa.demo.scheduler;

import Gestaodetarefa.demo.email.EMAILSEVICE.EmailService;
import Gestaodetarefa.demo.model.Task;
import Gestaodetarefa.demo.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TaskNotificationScheduler {

    // TODO: Implementar lógica de agendamento de notificações aqui

    @Autowired
    private TaskService taskService;

    @Autowired
    private EmailService emailService;

    @Scheduled(fixedRate = 60000)
    public void verificarTarefas() {
        List<Task> atrasadas = taskService.overdue();
        List<Task> proximas = taskService.dueSoon();

        if (!atrasadas.isEmpty()) {
            System.out.println(">>> Detectadas " + atrasadas.size() + " TAREFAS ATRASADAS. ENVIANDO E-MAILS...");
            atrasadas.forEach(task -> {
                String subject = "ALERTA: Tarefas Atrasadas - " + task.getTitle();
                String body = "A sua tarefa '" + task.getTitle() + "' esta atrasada! O prazo ja era " + task.getDueDate() + ".";

                String recipientEmail = "andersonarthur740@gmail.com";
                emailService.sendNotificationEmail(recipientEmail, subject, body);
            });
        }

        if (!proximas.isEmpty()) {
            System.out.print(">>> DETECTADAS " + proximas.size() + " TAREFAS PRÓXIMAS DO VENCIMENTO. ENVIANDO E-MAILS...");
            proximas.forEach(task -> {
                String subject = "LEMBRETE: Tarefas Próximas do vencimento - " + task.getTitle();
                String body = "A sua tarefa '" + task.getTitle() + "'esta proxima do vencimento. O prazo é´" + task.getTitle() + ".";
                String recipientEmail = "andersonarthur740@gmail.com";

                emailService.sendNotificationEmail(recipientEmail, subject, body);

            });
        }
        if (atrasadas.isEmpty() && proximas.isEmpty()){
            System.out.println(">>> Nenhuma tarefa urgente o momento. Verificação concluida.");
        }
    }
}
