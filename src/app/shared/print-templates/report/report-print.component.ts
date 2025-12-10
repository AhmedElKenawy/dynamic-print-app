/**
 * Report Print Template Component
 * 
 * Multi-section report template with cover page style header,
 * nested sections, data tables, and summary information.
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePrintTemplateComponent } from '../base/base-print-template.component';
import { ReportData, ReportSection } from '../../models/print.models';

@Component({
  selector: 'app-report-print',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-print.component.html',
  styleUrls: [
    '../base/base-print-template.component.scss',
    './report-print.component.scss'
  ]
})
export class ReportPrintComponent extends BasePrintTemplateComponent {
  /**
   * Report data - override with specific type
   */
  declare data: ReportData;

  /**
   * Format report date
   */
  getReportDate(): string {
    return this.formatDate(this.data.reportDate, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Check if section has content
   */
  hasSectionContent(section: ReportSection): boolean {
    return !!(section.content || section.subsections || section.data);
  }

  /**
   * Check if data is an array (for table display)
   */
  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  /**
   * Check if data is an object (for key-value display)
   */
  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  /**
   * Get object keys for iteration
   */
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  /**
   * Format data value for display
   */
  formatDataValue(value: any): string {
    if (typeof value === 'number') {
      return this.formatNumber(value);
    }
    if (value instanceof Date) {
      return this.formatDate(value);
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return String(value);
  }

  /**
   * Check if table data is provided
   */
  isTableData(data: any): boolean {
    return this.isArray(data) && data.length > 0 && this.isObject(data[0]);
  }

  /**
   * Get table headers from first data row
   */
  getTableHeaders(data: any[]): string[] {
    if (!data || data.length === 0) {
      return [];
    }
    return Object.keys(data[0]);
  }

  /**
   * Format header text (capitalize and add spaces)
   */
  formatHeader(header: string): string {
    return header
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Check if summary exists
   */
  hasSummary(): boolean {
    return !!(this.data.summary && this.data.summary.items && this.data.summary.items.length > 0);
  }

  /**
   * Get highlighted summary items
   */
  getHighlightedItems(): any[] {
    if (!this.hasSummary()) {
      return [];
    }
    return this.data.summary!.items.filter(item => item.highlight);
  }

  /**
   * Get non-highlighted summary items
   */
  getRegularItems(): any[] {
    if (!this.hasSummary()) {
      return [];
    }
    return this.data.summary!.items.filter(item => !item.highlight);
  }

  /**
   * Format summary value
   */
  formatSummaryValue(value: string | number): string {
    if (typeof value === 'number') {
      return this.formatNumber(value);
    }
    return String(value);
  }
}

