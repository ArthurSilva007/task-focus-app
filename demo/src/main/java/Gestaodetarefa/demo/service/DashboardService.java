package Gestaodetarefa.demo.service;

import Gestaodetarefa.demo.model.ChartDataDTO;
import Gestaodetarefa.demo.model.DashboardStatsDTO;
import Gestaodetarefa.demo.model.Status;
import Gestaodetarefa.demo.User.User;
import Gestaodetarefa.demo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Service
public class DashboardService {

    @Autowired
    private TaskRepository taskRepository;

    public DashboardStatsDTO getStatsForUser(User user) {
        long total = taskRepository.countByUser(user);
        long overdue = taskRepository.countByUserIdAndDueDateBefore(user.getId(), LocalDateTime.now());

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        long completed = taskRepository.countByUserIdAndStatusAndDueDateBetween(user.getId(), Status.CONCLUIDO, startOfDay, endOfDay);

        return new DashboardStatsDTO(total, overdue, completed);
    }
    public ChartDataDTO getTasksByStatusChartForUser(User user) {
        long pending = taskRepository.countByUserAndStatus(user, Status.A_FAZER);
        long inProgress = taskRepository.countByUserAndStatus(user, Status.EM_PROGRESSO);
        long completed = taskRepository.countByUserAndStatus(user, Status.CONCLUIDO);

        List<String> labels = Arrays.asList("A Fazer", "Em Progresso", "Concluído");
        List<Long> data = Arrays.asList(pending, inProgress, completed);

        return new ChartDataDTO(labels, data);
    }
}
