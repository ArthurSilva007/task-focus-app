export interface DashboardStats {
  totalTasks: number;
  overdueTasks: number;
  completedToday: number;
  dueInNext7Days: number; // <-- Adicione esta linha
}
