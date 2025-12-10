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
import { 
  InvoicePrintComponent,
  ReportPrintComponent,
  TablePrintComponent
} from './shared/print-templates';

/**
 * Factory function to register print templates on application startup
 * 
 * @param printService - Injected print service
 * @returns Initialization function
 */
export function registerPrintTemplates(printService: PrintService): () => void {
  return () => {
    // Register Invoice Template
    printService.registerTemplate(
      'invoice',
      InvoicePrintComponent,
      'Professional invoice template with itemized billing'
    );

    // Register Report Template
    printService.registerTemplate(
      'report',
      ReportPrintComponent,
      'Multi-section report template with data tables and summaries'
    );

    // Register Table Template
    printService.registerTemplate(
      'table',
      TablePrintComponent,
      'Data table template with customizable columns and filters'
    );

    console.log('Print templates registered successfully');
  };
}

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
