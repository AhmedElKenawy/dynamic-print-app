import { PrintService } from './print.service';
import { InvoicePrintComponent, ReportPrintComponent, TablePrintComponent } from '../../shared/print-templates';

/**
 * Helper to register the built-in print templates.
 * Kept separate to keep app.config.ts tidy.
 */
export function registerDefaultTemplates(printService: PrintService): () => void {
  return () => {
    printService.registerTemplate(
      'invoice',
      InvoicePrintComponent,
      'Professional invoice template with itemized billing'
    );

    printService.registerTemplate(
      'report',
      ReportPrintComponent,
      'Multi-section report template with data tables and summaries'
    );

    printService.registerTemplate(
      'table',
      TablePrintComponent,
      'Data table template with customizable columns and filters'
    );

    console.log('Print templates registered successfully');
  };
}

