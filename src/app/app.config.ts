/**
 * Application Configuration
 * 
 * Main configuration file for Angular standalone application.
 * Includes print template registration via APP_INITIALIZER.
 */

import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Dialog } from '@angular/cdk/dialog';
import { routes } from './app.routes';
import { PrintService } from './core/services/print.service';
import { registerDefaultTemplates } from './core/services/register-templates';

/**
 * Factory function to register print templates on application startup
 * 
 * @param printService - Injected print service
 * @returns Initialization function
 */
export const registerPrintTemplates = registerDefaultTemplates;

/**
 * Application configuration
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    Dialog,
    PrintService,
    {
      provide: APP_INITIALIZER,
      useFactory: registerPrintTemplates,
      deps: [PrintService],
      multi: true
    }
  ]
};
