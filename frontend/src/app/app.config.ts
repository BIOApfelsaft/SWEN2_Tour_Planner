import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ApiConfiguration } from './api/api-configuration';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: ApiConfiguration,
      useValue: { rootUrl: 'http://localhost:5134' } 
    }
  ]
};
