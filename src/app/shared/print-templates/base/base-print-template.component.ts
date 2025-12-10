/**
 * Base Print Template Component
 * 
 * Abstract base class that all print template components should extend.
 * Provides common functionality, helpers, and computed properties for print templates.
 */

import { Directive, Input, computed, signal } from '@angular/core';
import { PrintOptions, PageSize, Orientation } from '../../models/print.models';

@Directive()
export abstract class BasePrintTemplateComponent {
  /**
   * Data input - specific to each template implementation
   * Note: Child classes should declare their own typed data property
   */
  @Input({ required: true }) data: any = {};

  /**
   * Print options configuration
   */
  @Input() options?: PrintOptions;

  /**
   * Signal for reactive options
   */
  protected optionsSignal = signal<PrintOptions | undefined>(undefined);

  /**
   * Initialize options signal when input changes
   */
  ngOnInit(): void {
    this.optionsSignal.set(this.options);
  }

  /**
   * Update options if they change
   */
  ngOnChanges(): void {
    this.optionsSignal.set(this.options);
  }

  /**
   * Computed property for show header flag
   */
  readonly showHeader = computed(() => this.optionsSignal()?.showHeader ?? true);

  /**
   * Computed property for show footer flag
   */
  readonly showFooter = computed(() => this.optionsSignal()?.showFooter ?? true);

  /**
   * Computed property for page size
   */
  readonly pageSize = computed<PageSize>(() => this.optionsSignal()?.pageSize ?? 'A4');

  /**
   * Computed property for orientation
   */
  readonly orientation = computed<Orientation>(() => this.optionsSignal()?.orientation ?? 'portrait');

  /**
   * Computed property for RTL support
   */
  readonly isRtl = computed(() => this.optionsSignal()?.rtl ?? false);

  /**
   * Computed property for document title
   */
  readonly title = computed(() => this.optionsSignal()?.title ?? 'Document');

  /**
   * Computed property for show page numbers
   */
  readonly showPageNumbers = computed(() => this.optionsSignal()?.showPageNumbers ?? false);

  /**
   * Computed property for watermark
   */
  readonly watermark = computed(() => this.optionsSignal()?.watermark);

  /**
   * Get current date formatted for display
   * 
   * @returns Formatted date string
   */
  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Get current time formatted for display
   * 
   * @returns Formatted time string
   */
  getCurrentTime(): string {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  /**
   * Get current date and time
   * 
   * @returns Formatted date and time string
   */
  getCurrentDateTime(): string {
    return `${this.getCurrentDate()} ${this.getCurrentTime()}`;
  }

  /**
   * Format a date value
   * 
   * @param date - Date to format
   * @param format - Optional format options
   * @returns Formatted date string
   */
  formatDate(date: Date | string, format?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const defaultFormat: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return dateObj.toLocaleDateString('en-US', format || defaultFormat);
  }

  /**
   * Format a currency value
   * 
   * @param value - Numeric value
   * @param currency - Currency code (default: USD)
   * @param locale - Locale string (default: en-US)
   * @returns Formatted currency string
   */
  formatCurrency(value: number, currency: string = 'USD', locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(value);
  }

  /**
   * Format a number value
   * 
   * @param value - Numeric value
   * @param decimals - Number of decimal places
   * @param locale - Locale string (default: en-US)
   * @returns Formatted number string
   */
  formatNumber(value: number, decimals: number = 2, locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }

  /**
   * Get CSS classes for the print container
   * 
   * @returns Array of CSS class names
   */
  getContainerClasses(): string[] {
    const classes = [
      'print-container',
      `page-${this.pageSize().toLowerCase()}`,
      `orientation-${this.orientation()}`
    ];

    if (this.isRtl()) {
      classes.push('rtl');
    }

    return classes;
  }

  /**
   * Sanitize HTML content (basic implementation)
   * For production, consider using Angular's DomSanitizer
   * 
   * @param html - HTML string
   * @returns Sanitized HTML
   */
  protected sanitizeHtml(html: string): string {
    // Basic sanitization - strip script tags
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  /**
   * Check if a value is empty
   * 
   * @param value - Value to check
   * @returns True if empty
   */
  protected isEmpty(value: any): boolean {
    return value === null || value === undefined || value === '';
  }

  /**
   * Lifecycle hook for cleanup
   */
  ngOnDestroy(): void {
    // Override in child classes if needed
  }
}

