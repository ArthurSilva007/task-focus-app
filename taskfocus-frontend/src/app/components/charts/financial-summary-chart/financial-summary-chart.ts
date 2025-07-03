import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-financial-summary-chart',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="chart-container"><canvas #canvas></canvas></div>',
  styles: [`
    .chart-container {
      position: relative;
      height: 100%;
      width: 100%;
    }
  `]
})
export class FinancialSummaryChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('canvas') canvas?: ElementRef<HTMLCanvasElement>;

  @Input() data: { income: number, expenses: number } = { income: 0, expenses: 0 };

  private chart?: Chart;

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart) {
      this.updateChart();
    }
  }

  private createChart(): void {
    if (!this.canvas) return;

    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Resumo'], // Label geral
        datasets: [
          {
            label: 'Receita',
            data: [this.data.income],
            backgroundColor: '#50FA7B', // Verde
            borderRadius: 5,
          },
          {
            label: 'Despesas',
            data: [this.data.expenses],
            backgroundColor: '#FF5555', // Vermelho
            borderRadius: 5,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // Deixa as barras na horizontal
        plugins: {
          legend: {
            display: false // Esconde a legenda
          }
        },
        scales: {
          x: {
            display: false, // Esconde o eixo X
            grid: { display: false }
          },
          y: {
            display: false, // Esconde o eixo Y
            grid: { display: false }
          }
        }
      }
    });
  }

  private updateChart(): void {
    if (this.chart) {
      this.chart.data.datasets[0].data = [this.data.income];
      this.chart.data.datasets[1].data = [this.data.expenses];
      this.chart.update();
    }
  }
}
