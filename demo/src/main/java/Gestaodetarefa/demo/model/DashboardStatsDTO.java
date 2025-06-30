package Gestaodetarefa.demo.model;

// Usando Lombok para reduzir o código boilerplate
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalTasks;
    private long overdueTasks;
    private long completedToday;
    // Adicionaremos mais estatísticas aqui depois
}