import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/dashboard-stats.model';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { PieChartComponent } from '../../components/charts/pie-chart/pie-chart.component';
 import { Modal } from 'bootstrap';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TaskFormComponent, PieChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  stats: DashboardStats = { totalTasks: 0, overdueTasks: 0, completedToday: 0 };
  tasks: Task[] = [];
  currentTaskToEdit: Task | null = null;

  // Variáveis do gráfico
  statusChartLabels: string[] = [];
  statusChartData: number[] = [];

  // Referência para o elemento do modal no HTML
  @ViewChild('taskFormModal') taskModalElement!: ElementRef;
  private bootstrapModal: Modal | undefined;

  constructor(
    private dashboardService: DashboardService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngAfterViewInit(): void {
    if (this.taskModalElement) {
      import('bootstrap').then(({ Modal }) => {
        this.bootstrapModal = new Modal(this.taskModalElement.nativeElement);
      });
    }
  }


  loadInitialData(): void {
    this.loadStats();
    this.loadTasks();
    this.loadChartData();
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

  loadChartData(): void {
    // Este método buscará os dados do gráfico.
    // Certifique-se de que o método getTasksByStatusChart() existe no seu DashboardService.
    this.dashboardService.getTasksByStatusChart().subscribe(data => {
      this.statusChartLabels = data.labels;
      this.statusChartData = data.data;
    });
  }

  openCreateModal(): void {
    this.currentTaskToEdit = null;
    this.bootstrapModal?.show();
  }

  openEditModal(task: Task): void {
    this.currentTaskToEdit = task;
    this.bootstrapModal?.show();
  }

  // Este método é chamado quando uma tarefa é criada ou atualizada
  handleTaskUpdate(): void {
    this.loadInitialData(); // Recarrega todos os dados
    this.bootstrapModal?.hide(); // Fecha o modal
  }

  // O MÉTODO DELETE, AGORA NO LUGAR CORRETO
  deleteTask(taskId: number): void {
    if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          console.log('Tarefa deletada com sucesso');
          this.loadInitialData(); // Recarrega todos os dados
        },
        error: (err) => console.error('Erro ao deletar tarefa', err)
      });
    }
  }
}
