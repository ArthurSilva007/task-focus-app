import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="chart-container"><canvas #barChartCanvas></canvas></div>',
  styles: [`
    .chart-container {
      position: relative;
      height: 250px; // Altura fixa para o gráfico
    }
  `]
})
export class BarChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('barChartCanvas') barChartCanvas?: ElementRef<HTMLCanvasElement>;

  @Input() chartData: number[] = [];
  @Input() chartLabels: string[] = [];

  private chart?: Chart;
  private readonly barColor = 'rgba(108, 99, 255, 0.8)'; // Cor roxa/azul do seu design
  private readonly barHoverColor = 'rgba(108, 99, 255, 1)';

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart) {
      this.updateChart();
    }
  }

  private createChart(): void {
    if (!this.barChartCanvas) return;
    const ctx = this.barChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.chartLabels,
        datasets: [{
          data: this.chartData,
          backgroundColor: this.barColor,
          borderColor: this.barHoverColor,
          borderWidth: 1,
          borderRadius: 5,
          hoverBackgroundColor: this.barHoverColor
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false // Sem legenda, como no protótipo
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)' // Linhas do grid sutis
            },
            ticks: {
              color: '#A9A9A9' // Cor dos números do eixo Y
            }
          },
          x: {
            grid: {
              display: false // Sem linhas de grid verticais
            },
            ticks: {
              color: '#A9A9A9' // Cor das labels do eixo X
            }
          }
        }
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
