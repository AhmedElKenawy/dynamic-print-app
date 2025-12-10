/**
 * Invoice Print Template Component
 * 
 * Professional invoice template with company header, customer details,
 * itemized billing, and payment information.
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePrintTemplateComponent } from '../base/base-print-template.component';
import { InvoiceData } from '../../models/print.models';

@Component({
  selector: 'app-invoice-print',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-print.component.html',
  styleUrls: [
    '../base/base-print-template.component.scss',
    './invoice-print.component.scss'
  ]
})
export class InvoicePrintComponent extends BasePrintTemplateComponent {
  /**
   * Invoice data - override with specific type
   */
  declare data: InvoiceData;

  /**
   * Calculate item tax if tax rate is provided
   */
  getItemTax(item: any): number {
    return item.taxRate ? (item.total * item.taxRate) / 100 : 0;
  }

  /**
   * Calculate total with tax for an item
   */
  getItemTotalWithTax(item: any): number {
    return item.total + this.getItemTax(item);
  }

  /**
   * Calculate grand total (subtotal + tax - discount + shipping)
   */
  getGrandTotal(): number {
    let total = this.data.total;
    
    if (this.data.discount) {
      total -= this.data.discount;
    }
    
    if (this.data.shipping) {
      total += this.data.shipping;
    }
    
    return total;
  }

  /**
   * Format invoice date
   */
  getInvoiceDate(): string {
    return this.formatDate(this.data.invoiceDate);
  }

  /**
   * Format due date
   */
  getDueDate(): string {
    return this.formatDate(this.data.dueDate);
  }

  /**
   * Check if invoice is overdue
   */
  isOverdue(): boolean {
    const dueDate = new Date(this.data.dueDate);
    return dueDate < new Date();
  }

  /**
   * Get currency symbol from currency code
   */
  getCurrencySymbol(): string {
    const symbols: Record<string, string> = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'AED': 'د.إ',
      'SAR': '﷼',
      'EGP': 'ج.م'
    };
    return symbols[this.data.currency] || this.data.currency;
  }

  /**
   * Format currency with proper symbol and locale
   */
  formatInvoiceCurrency(value: number): string {
    return this.formatCurrency(value, this.data.currency);
  }
}

