import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule],
  template: '<canvas #pieChartCanvas></canvas>',
})
export class PieChartComponent implements OnChanges, AfterViewInit {
  @ViewChild('pieChartCanvas') pieChartCanvas?: ElementRef<HTMLCanvasElement>;

  @Input() chartData: number[] = [];
  @Input() chartLabels: string[] = [];

  private chart?: Chart;

  private readonly chartColors = [
    '#8BE9FD', // Em Andamento (Azul)
    '#FFB86C', // Pendente (Laranja)
    '#50FA7B', // Concluído (Verde)
    '#FF79C6', // Outra cor (Rosa)
    '#BD93F9'  // Outra cor (Roxo)
  ];

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Apenas atualiza o gráfico se ele já tiver sido criado
    if (this.chart) {
      this.updateChart();
    }
  }

  private createChart(): void {
    if (!this.pieChartCanvas) {
      return;
    }
    const ctx = this.pieChartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.chartLabels,
        datasets: [{
          data: this.chartData,
          backgroundColor: this.chartColors,
          borderColor: '#1A1A2E',
          borderWidth: 4,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#A9A9A9'
            }
          }
        },
        cutout: '70%'
      }
    });
  }

  private updateChart(): void {
    if (this.chart) {
      this.chart.data.labels = this.chartLabels;
      this.chart.data.datasets[0].data = this.chartData;
      this.chart.update();
    }
  }
}
