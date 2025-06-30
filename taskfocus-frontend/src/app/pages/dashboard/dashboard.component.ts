import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/dashboard-stats.model';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskFormComponent } from '../../components/task-form/task-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = { totalTasks: 0, overdueTasks: 0, completedToday: 0 };
  tasks: Task[] = [];
  currentTaskToEdit: Task | null = null; // Armazena a tarefa a ser editada

  constructor(
    private dashboardService: DashboardService,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loadStats();
    this.loadTasks();
  }

  loadStats(): void {
    this.dashboardService.getStats().subscribe(data => this.stats = data);
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data;
      console.log('Tarefas carregadas!', data);
    });
  }

  openCreateModal(): void {
    this.currentTaskToEdit = null;
  }

  openEditModal(task: Task): void {
    this.currentTaskToEdit = task;
  }

  deleteTask(taskId: number): void {
    if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          console.log('Tarefa deletada com sucesso');
          this.loadInitialData(); // Recarrega tudo após deletar
        },
        error: (err) => console.error('Erro ao deletar tarefa', err)
      });
    }
  }
}
