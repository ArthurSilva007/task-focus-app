import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // Só tenta pegar o token se estivermos no navegador.
  if (isPlatformBrowser(platformId)) {
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      // Clona a requisição e adiciona o cabeçalho de autorização.
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
      return next(authReq);
    }
  }

  // Se estiver no servidor ou não houver token, envia a requisição original.
  return next(req);
};

