import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto'; // Importa a biblioteca principal

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #pieCanvas></canvas>`, // O template é apenas o canvas para o gráfico
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements AfterViewInit, OnChanges {
  @Input() chartData: number[] = [];
  @Input() chartLabels: string[] = [];
  @ViewChild('pieCanvas') pieCanvas!: ElementRef;

  chart: any;

  constructor() { }

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Se os dados ou os rótulos mudarem, atualiza o gráfico
    if (this.chart && (changes['chartData'] || changes['chartLabels'])) {
      this.chart.data.labels = this.chartLabels;
      this.chart.data.datasets[0].data = this.chartData;
      this.chart.update();
    }
  }

  createChart(): void {
    // Previne a criação de múltiplos gráficos no mesmo canvas
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie', // ou 'doughnut' para o gráfico de anel
      data: {
        labels: this.chartLabels,
        datasets: [{
          label: 'Tarefas por Status',
          data: this.chartData,
          backgroundColor: [
            '#FF6384', // Cor para o primeiro valor (ex: A Fazer)
            '#36A2EB', // Cor para o segundo valor (ex: Em Progresso)
            '#FFCE56'  // Cor para o terceiro valor (ex: Concluído)
          ],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    });
  }
}
