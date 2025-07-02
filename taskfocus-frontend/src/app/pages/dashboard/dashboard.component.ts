import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/dashboard-stats.model';
import { ChartData } from '../../models/chart-data.model';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { PieChartComponent } from '../../components/charts/pie-chart/pie-chart.component';
import { BarChartComponent } from '../../components/charts/bar-chart/bar-chart.component';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

declare var Modal: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TaskFormComponent,
    PieChartComponent,
    BarChartComponent,
    ConfirmationModalComponent,
    DatePipe,
    CurrencyPipe,
    TitleCasePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('taskFormModal') taskFormModalElement?: ElementRef;
  private bootstrapModal?: any;

  // Propriedades para dados
  tasks: Task[] = [];
  stats: DashboardStats = { totalTasks: 0, overdueTasks: 0, completedToday: 0, dueInNext7Days: 0 };
  statusChartLabels: string[] = [];
  statusChartData: number[] = [];
  weeklyProgressLabels: string[] = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  weeklyProgressData: number[] = [5, 3, 6, 4, 7, 5, 2];
  habitDistributionLabels: string[] = ['Trabalho', 'Estudo', 'Pessoal'];
  habitDistributionData: number[] = [43.0, 32.0, 25.0];
  totalHabitPercentage: number = 78;
  averageDailyHabits: number = 5.2;
  totalMonthSpending: number = 1500.00;

  // Propriedades de estado
  currentTaskToEdit: Task | null = null;
  showDeleteConfirmation = false;
  taskToDelete: Task | null = null;

  constructor(
    private taskService: TaskService,
    private dashboardService: DashboardService,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = await import('bootstrap');
      if (this.taskFormModalElement) {
        this.bootstrapModal = new bootstrap.Modal(this.taskFormModalElement.nativeElement);
      }
    }
  }

  loadDashboardData(): void {
    this.loadTasks();
    this.loadStats();
    this.loadStatusChartData();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data: Task[]) => this.tasks = data,
      error: (err: any) => this.toastr.error('Falha ao carregar as tarefas.')
    });
  }

  loadStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (data: DashboardStats) => this.stats = data,
      error: (err: any) => this.toastr.error('Falha ao carregar as estatísticas.')
    });
  }

  loadStatusChartData(): void {
    this.dashboardService.getTasksByStatusChart().subscribe({
      next: (data: ChartData) => {
        this.statusChartLabels = data.labels;
        this.statusChartData = data.data;
      },
      error: (err: any) => this.toastr.error('Falha ao carregar o gráfico de status.')
    });
  }

  openCreateModal(): void {
    this.currentTaskToEdit = null;
    this.bootstrapModal?.show();
  }

  openEditModal(task: Task): void {
    this.currentTaskToEdit = { ...task };
    this.bootstrapModal?.show();
  }

  closeModal(): void {
    this.bootstrapModal?.hide();
  }

  handleTaskUpdate(): void {
    this.closeModal();
    this.loadDashboardData();
  }

  deleteTask(task: Task): void {
    this.taskToDelete = task;
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.taskToDelete = null;
  }

  confirmDelete(): void {
    if (!this.taskToDelete || !this.taskToDelete.id) return;
    this.taskService.deleteTask(this.taskToDelete.id).subscribe({
      next: () => {
        this.toastr.success(`Tarefa '${this.taskToDelete?.title}' deletada!`);
        this.loadDashboardData();
      },
      error: (err: any) => this.toastr.error('Erro ao deletar a tarefa.'),
      complete: () => this.cancelDelete()
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDENTE': case 'A_FAZER': return 'status-pendente';
      case 'EM_ANDAMENTO': case 'EM_PROGRESSO': return 'status-em_andamento';
      case 'CONCLUIDO': return 'status-concluido';
      default: return '';
    }
  }
}
