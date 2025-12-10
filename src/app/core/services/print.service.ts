/**
 * Print Service
 * 
 * Central service for managing print templates and operations.
 * Handles template registration, retrieval, and printing functionality.
 * Uses Angular CDK Dialog for print preview modal.
 */

import { Injectable, Type, inject } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { PrintConfig, PrintTemplate, PrintOptions, PrintPreviewData } from '../../shared/models/print.models';
import { PrintPreviewComponent } from '../../shared/components/print-preview/print-preview.component';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  private readonly dialog = inject(Dialog);
  
  /**
   * Registry map storing all registered print templates
   * Key: template identifier, Value: template metadata
   */
  private readonly templateRegistry = new Map<string, PrintTemplate>();
  
  /**
   * Active dialog reference for cleanup
   */
  private activeDialogRef: DialogRef<any, any> | null = null;

  /**
   * Register a print template in the registry
   * 
   * @param key - Unique identifier for the template
   * @param component - Angular component class for the template
   * @param description - Optional description of the template
   * @throws Error if template with the same key already exists
   */
  registerTemplate(
    key: string,
    component: Type<any>,
    description?: string
  ): void {
    if (this.templateRegistry.has(key)) {
      console.warn(`Print template with key '${key}' is already registered. Overwriting...`);
    }
    
    this.templateRegistry.set(key, {
      key,
      component,
      description
    });
    
    console.log(`Print template '${key}' registered successfully`);
  }

  /**
   * Retrieve a registered template by key
   * 
   * @param key - Template identifier
   * @returns Template metadata or undefined if not found
   */
  getTemplate(key: string): PrintTemplate | undefined {
    return this.templateRegistry.get(key);
  }

  /**
   * Get all registered template keys
   * 
   * @returns Array of registered template keys
   */
  getRegisteredTemplates(): string[] {
    return Array.from(this.templateRegistry.keys());
  }

  /**
   * Get all registered templates with their metadata
   * 
   * @returns Array of template metadata objects
   */
  getAllTemplates(): PrintTemplate[] {
    return Array.from(this.templateRegistry.values());
  }

  /**
   * Check if a template is registered
   * 
   * @param key - Template identifier
   * @returns True if template exists
   */
  hasTemplate(key: string): boolean {
    return this.templateRegistry.has(key);
  }

  /**
   * Open print preview modal with the specified template
   * 
   * @param config - Print configuration including template key, data, and options
   * @returns Promise that resolves when dialog is closed
   * @throws Error if template is not found
   */
  preview(config: PrintConfig): Promise<void> {
    const template = this.getTemplate(config.templateKey);
    
    if (!template) {
      const availableTemplates = this.getRegisteredTemplates().join(', ');
      throw new Error(
        `Print template '${config.templateKey}' not found. ` +
        `Available templates: ${availableTemplates || 'none'}`
      );
    }

    // Prepare data for the preview component
    const previewData: PrintPreviewData = {
      templateComponent: template.component,
      data: config.data,
      options: this.mergeDefaultOptions(config.options)
    };

    // Close any existing dialog
    if (this.activeDialogRef) {
      this.activeDialogRef.close();
    }

    // Open the print preview dialog
    this.activeDialogRef = this.dialog.open(PrintPreviewComponent, {
      data: previewData,
      width: '90vw',
      height: '90vh',
      maxWidth: '1400px',
      panelClass: 'print-preview-dialog',
      disableClose: false,
      backdropClass: 'print-preview-backdrop'
    });

    // Wait for dialog to close
    return new Promise<void>((resolve) => {
      this.activeDialogRef!.closed.subscribe(() => {
        this.activeDialogRef = null;
        resolve();
      });
    });
  }

  /**
   * Print directly without showing preview modal
   * Opens the template in a hidden iframe and triggers print
   * 
   * @param config - Print configuration
   * @throws Error if template is not found
   */
  printDirect(config: PrintConfig): Promise<void> {
    const template = this.getTemplate(config.templateKey);
    
    if (!template) {
      throw new Error(`Print template '${config.templateKey}' not found`);
    }

    // For direct printing, we still need to render the component
    // We'll open the preview but auto-trigger print and close
    const previewPromise = this.preview(config);
    
    // Small delay to ensure rendering is complete
    setTimeout(() => {
      this.print();
    }, 100);
    
    return previewPromise;
  }

  /**
   * Trigger the browser's native print dialog
   * This is called from the print preview component
   */
  print(): void {
    // Small delay to ensure all content is rendered
    setTimeout(() => {
      window.print();
    }, 250);
  }

  /**
   * Close the active print preview dialog
   */
  closePreview(): void {
    if (this.activeDialogRef) {
      this.activeDialogRef.close();
      this.activeDialogRef = null;
    }
  }

  /**
   * Merge provided options with default values
   * 
   * @param options - User-provided options
   * @returns Complete options object with defaults
   */
  private mergeDefaultOptions(options?: PrintOptions): PrintOptions {
    const defaults: PrintOptions = {
      orientation: 'portrait',
      pageSize: 'A4',
      showHeader: true,
      showFooter: true,
      showPageNumbers: false,
      title: 'Document',
      rtl: false,
      copies: 1
    };

    return { ...defaults, ...options };
  }

  /**
   * Unregister a template from the registry
   * 
   * @param key - Template identifier to remove
   * @returns True if template was removed, false if not found
   */
  unregisterTemplate(key: string): boolean {
    return this.templateRegistry.delete(key);
  }

  /**
   * Clear all registered templates
   * Useful for testing or dynamic template management
   */
  clearAllTemplates(): void {
    this.templateRegistry.clear();
    console.log('All print templates cleared');
  }

  /**
   * Get statistics about registered templates
   * 
   * @returns Object with template count and keys
   */
  getStats(): { count: number; templates: string[] } {
    return {
      count: this.templateRegistry.size,
      templates: this.getRegisteredTemplates()
    };
  }
}

