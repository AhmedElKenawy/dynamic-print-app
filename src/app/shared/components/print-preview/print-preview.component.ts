/**
 * Print Preview Component
 * 
 * Modal dialog component for previewing print templates before printing.
 * Uses Angular CDK Dialog and Portal for dynamic component rendering.
 */

import {
  Component,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  OnDestroy,
  Inject,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ComponentPortal, PortalModule } from '@angular/cdk/portal';
import { PrintPreviewData } from '../../models/print.models';
import { PrintService } from '../../../core/services/print.service';

@Component({
  selector: 'app-print-preview',
  standalone: true,
  imports: [CommonModule, PortalModule],
  templateUrl: './print-preview.component.html',
  styleUrls: ['./print-preview.component.scss']
})
export class PrintPreviewComponent implements AfterViewInit, OnDestroy {
  /**
   * View container reference for dynamic component rendering
   */
  @ViewChild('templateContainer', { read: ViewContainerRef, static: false })
  templateContainer!: ViewContainerRef;

  /**
   * Loading state signal
   */
  readonly isLoading = signal(true);

  /**
   * Error state signal
   */
  readonly error = signal<string | null>(null);

  /**
   * Success state computed from loading and error
   */
  readonly isReady = computed(() => !this.isLoading() && !this.error());

  /**
   * Portal for dynamic component
   */
  private componentPortal: ComponentPortal<any> | null = null;

  constructor(
    @Inject(DIALOG_DATA) public data: PrintPreviewData,
    private dialogRef: DialogRef<PrintPreviewComponent>,
    private printService: PrintService
  ) {}

  /**
   * After view initialization, load the template component
   */
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadTemplate();
    }, 0);
  }

  /**
   * Load and render the template component dynamically
   */
  private loadTemplate(): void {
    try {
      console.log('Loading template...', this.data);
      console.log('Template component:', this.data.templateComponent);
      console.log('ViewContainerRef:', this.templateContainer);

      if (!this.templateContainer) {
        throw new Error('ViewContainerRef is not available');
      }

      if (!this.data.templateComponent) {
        throw new Error('Template component is not defined');
      }

      // Attach the portal to the view container
      const componentRef = this.templateContainer.createComponent(
        this.data.templateComponent
      );

      console.log('Component created:', componentRef);

      // Set inputs on the component instance
      componentRef.instance.data = this.data.data;
      componentRef.instance.options = this.data.options;

      // Trigger change detection
      componentRef.changeDetectorRef.detectChanges();

      // Mark as loaded
      this.isLoading.set(false);
      console.log('Template loaded successfully');
    } catch (err) {
      console.error('Error loading print template:', err);
      this.error.set('Failed to load print template. Please try again.');
      this.isLoading.set(false);
    }
  }

  /**
   * Trigger print operation
   */
  onPrint(): void {
    this.printService.print();
  }

  /**
   * Close the preview dialog
   */
  onClose(): void {
    this.dialogRef.close();
  }

  /**
   * Handle keyboard shortcuts
   */
  onKeydown(event: KeyboardEvent): void {
    // Ctrl/Cmd + P to print
    if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
      event.preventDefault();
      this.onPrint();
    }
    // Escape to close
    else if (event.key === 'Escape') {
      event.preventDefault();
      this.onClose();
    }
  }

  /**
   * Cleanup on destroy
   */
  ngOnDestroy(): void {
    if (this.componentPortal) {
      this.componentPortal = null;
    }
  }

  /**
   * Get the document title for display
   */
  getTitle(): string {
    return this.data.options?.title || 'Print Preview';
  }
}

