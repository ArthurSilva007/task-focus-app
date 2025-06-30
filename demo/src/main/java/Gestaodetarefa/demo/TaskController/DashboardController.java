package Gestaodetarefa.demo.TaskController;

import Gestaodetarefa.demo.model.ChartDataDTO;
import Gestaodetarefa.demo.model.DashboardStatsDTO;
import Gestaodetarefa.demo.service.DashboardService;
import Gestaodetarefa.demo.User.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        DashboardStatsDTO stats = dashboardService.getStatsForUser(currentUser);
        return ResponseEntity.ok(stats);
    }
    @GetMapping("/tasks-by-status")
    public ResponseEntity<ChartDataDTO> getTasksByStatusChart(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        ChartDataDTO chartData = dashboardService.getTasksByStatusChartForUser(currentUser);
        return ResponseEntity.ok(chartData);
    }
}