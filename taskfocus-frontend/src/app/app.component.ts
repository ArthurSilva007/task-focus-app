import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core'; // Adicionado OnInit
import { isPlatformBrowser } from '@angular/common'; // Importação adicionada
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit { // Implementa OnInit

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Esta é a correção: Importa dinamicamente o JS do Bootstrap SÓ no navegador.
    if (isPlatformBrowser(this.platformId)) {
      import('bootstrap');
    }
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('authToken');
    }
    return false;
  }

  logout(event: MouseEvent): void {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
