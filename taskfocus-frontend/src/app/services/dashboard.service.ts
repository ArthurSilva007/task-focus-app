import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStats } from '../models/dashboard-stats.model';
import { ChartData } from '../models/chart-data.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080/api/dashboard';

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    // O interceptor já injeta o token no cabeçalho
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }
  getTasksByStatusChart(): Observable<ChartData> {
    // O interceptor já adiciona o token para nós.
    return this.http.get<ChartData>(`${this.apiUrl}/tasks-by-status`);
  }
}
