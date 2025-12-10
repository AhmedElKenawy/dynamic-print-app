/**
 * Table Print Template Component
 * 
 * Data table template with customizable columns, formatting,
 * optional row numbers, filters display, and summary statistics.
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePrintTemplateComponent } from '../base/base-print-template.component';
import { TableData, TableColumn } from '../../models/print.models';

@Component({
  selector: 'app-table-print',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-print.component.html',
  styleUrls: [
    '../base/base-print-template.component.scss',
    './table-print.component.scss'
  ]
})
export class TablePrintComponent extends BasePrintTemplateComponent {
  /**
   * Table data - override with specific type
   */
  declare data: TableData;

  /**
   * Get cell value with proper formatting
   * 
   * @param row - Data row
   * @param column - Column definition
   * @returns Formatted cell value
   */
  getCellValue(row: any, column: TableColumn): string {
    const value = row[column.field];
    
    // Use custom format function if provided
    if (column.format) {
      return column.format(value, row);
    }

    // Default formatting based on value type
    return this.formatDataValue(value);
  }

  /**
   * Format data value for display
   */
  private formatDataValue(value: any): string {
    if (value === null || value === undefined) {
      return '-';
    }
    
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
   * Get alignment class for column
   */
  getAlignmentClass(column: TableColumn): string {
    const align = column.align || 'left';
    return `text-${align}`;
  }

  /**
   * Get column style object
   */
  getColumnStyle(column: TableColumn): { [key: string]: string } {
    const style: { [key: string]: string } = {};
    
    if (column.width) {
      style['width'] = column.width;
    }
    
    return style;
  }

  /**
   * Check if filters are present
   */
  hasFilters(): boolean {
    return !!(this.data.filters && this.data.filters.length > 0);
  }

  /**
   * Check if summary is present
   */
  hasSummary(): boolean {
    return !!(this.data.summary && this.data.summary.length > 0);
  }

  /**
   * Get generated date formatted
   */
  getGeneratedDate(): string {
    if (this.data.generatedDate) {
      return this.formatDate(this.data.generatedDate, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return this.getCurrentDateTime();
  }

  /**
   * Get row count display
   */
  getRowCount(): string {
    const total = this.data.totalRecords || this.data.rows.length;
    const displayed = this.data.rows.length;
    
    if (total === displayed) {
      return `${total} record${total !== 1 ? 's' : ''}`;
    }
    
    return `Showing ${displayed} of ${total} records`;
  }

  /**
   * Calculate column span for header sections
   */
  getHeaderColspan(): number {
    return this.data.columns.length + (this.data.showRowNumbers ? 1 : 0);
  }
}

