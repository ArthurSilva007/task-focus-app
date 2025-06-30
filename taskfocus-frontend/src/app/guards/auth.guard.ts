import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  // A VERIFICAÇÃO CRÍTICA: Só executa a lógica se estiver no navegador.
  if (isPlatformBrowser(platformId)) {
    // Se existe um token no localStorage, o usuário pode passar.
    if (localStorage.getItem('authToken')) {
      return true;
    }
  }

  // Se não estiver no navegador ou não houver token, redireciona para a página de login.
  // No servidor, isso não fará nada, mas no cliente, fará o redirecionamento correto.
  router.navigate(['/login']);
  return false;
};
