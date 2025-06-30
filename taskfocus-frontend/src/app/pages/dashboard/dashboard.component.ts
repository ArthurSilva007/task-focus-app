import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/dashboard-stats.model';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { PieChartComponent } from '../../components/charts/pie-chart/pie-chart.component';

// Importamos o Modal de forma seletiva para evitar problemas no servidor
let Modal: any = null;

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

  statusChartLabels: string[] = [];
  statusChartData: number[] = [];

  @ViewChild('taskFormModal') taskModalElement!: ElementRef;
  private bootstrapModal: any;

  constructor(
    private dashboardService: DashboardService,
    private taskService: TaskService,
    @Inject(PLATFORM_ID) private platformId: Object // Injeta um token para saber o ambiente
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  async ngAfterViewInit(): Promise<void> {
    // A CORREÇÃO FINAL: Só carrega e inicializa o Modal se estivermos num navegador.
    if (isPlatformBrowser(this.platformId)) {
      // Importa a classe Modal dinamicamente, apenas no lado do cliente
      const bootstrap = await import('bootstrap');
      Modal = bootstrap.Modal;
      if (this.taskModalElement) {
        this.bootstrapModal = new Modal(this.taskModalElement.nativeElement);
      }
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
    this.taskService.getTasks().subscribe(data => this.tasks = data);
  }

  loadChartData(): void {
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

  handleTaskUpdate(): void {
    this.loadInitialData();
    this.bootstrapModal?.hide();
  }

  deleteTask(taskId: number): void {
    if (confirm('Tem a certeza que deseja apagar esta tarefa?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          console.log('Tarefa apagada com sucesso');
          this.loadInitialData();
        },
        error: (err) => console.error('Erro ao apagar tarefa', err)
      });
    }
  }
}
