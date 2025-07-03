import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/dashboard-stats.model';
// A importação de 'ChartData' foi removida pois não era usada diretamente.
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { PieChartComponent } from '../../components/charts/pie-chart/pie-chart.component';
import { BarChartComponent } from '../../components/charts/bar-chart/bar-chart.component';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

// A linha 'declare var Modal: any;' foi removida pois é desnecessária.

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

  weeklyProgressLabels: string[] = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  weeklyProgressData: number[] = [5, 3, 6, 4, 7, 5, 2];

  // Propriedades para dados
  tasks: Task[] = [];
  stats: DashboardStats = { totalTasks: 0, overdueTasks: 0, completedToday: 0, dueInNext7Days: 0 };
  statusChartLabels: string[] = [];
  statusChartData: number[] = [];
  weeklyProgressChartData: any;
  financialSummaryChartData: any;
  financialData = { income: 5500, expenses: 3565 };
  habitDistributionLabels: string[] = ['Trabalho', 'Estudo', 'Pessoal'];
  habitDistributionData: number[] = [43, 32, 25];
  totalHabitPercentage: number = 78;
  averageDailyHabits: number = 5.2;
  totalMonthSpending: number = 1500.00;

  // Propriedades de estado da UI
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
    this.prepareChartData();
    this.loadApiData();
  }

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = await import('bootstrap');
      if (this.taskFormModalElement) {
        this.bootstrapModal = new bootstrap.Modal(this.taskFormModalElement.nativeElement);
      }
    }
  }

  prepareChartData(): void {
    this.weeklyProgressChartData = {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      datasets: [{
        label: 'Hábitos Concluídos',
        data: [5, 3, 6, 4, 7, 5, 2],
        backgroundColor: 'rgba(108, 99, 255, 0.8)',
        borderColor: 'rgba(108, 99, 255, 1)',
        borderWidth: 1,
        borderRadius: 5,
      }]
    };

    this.financialSummaryChartData = {
      labels: [''],
      datasets: [
        { label: 'Receita', data: [this.financialData.income], backgroundColor: '#50FA7B', barThickness: 20, borderRadius: 5 },
        { label: 'Despesas', data: [this.financialData.expenses], backgroundColor: '#FF5555', barThickness: 20, borderRadius: 5 }
      ]
    };
  }

  loadApiData(): void {
    this.loadTasks();
    this.loadStats();
    this.loadStatusChartData();
  }

  loadTasks(): void { this.taskService.getTasks().subscribe({ next: (data: Task[]) => { this.tasks = data; } }); }
  loadStats(): void { this.dashboardService.getStats().subscribe({ next: (data: DashboardStats) => { this.stats = data; } }); }

  loadStatusChartData(): void {
    this.dashboardService.getTasksByStatusChart().subscribe({
      next: (data: any) => { // Usamos 'any' aqui para simplicidade, já que 'ChartData' foi removido
        this.statusChartLabels = data.labels;
        this.statusChartData = data.data;
      }
    });
  }

  // --- O resto dos seus métodos permanecem os mesmos ---
  openCreateModal(): void { this.currentTaskToEdit = null; this.bootstrapModal?.show(); }
  openEditModal(task: Task): void { this.currentTaskToEdit = { ...task }; this.bootstrapModal?.show(); }
  closeModal(): void { this.bootstrapModal?.hide(); }
  handleTaskUpdate(): void { this.closeModal(); this.loadApiData(); }
  deleteTask(task: Task): void { this.taskToDelete = task; this.showDeleteConfirmation = true; }
  cancelDelete(): void { this.showDeleteConfirmation = false; this.taskToDelete = null; }

  confirmDelete(): void {
    if (!this.taskToDelete?.id) return;
    this.taskService.deleteTask(this.taskToDelete.id).subscribe(() => {
      this.toastr.success(`Tarefa '${this.taskToDelete?.title}' deletada!`);
      this.loadApiData();
      this.cancelDelete();
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
