/**
 * Custom Template Example
 * 
 * This file demonstrates how to create a custom print template
 * from scratch. Follow this pattern to create your own templates.
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePrintTemplateComponent } from '../src/app/shared/print-templates/base/base-print-template.component';

// ============================================================================
// Step 1: Define Your Data Interface
// ============================================================================

/**
 * Define the data structure for your custom template
 */
export interface PurchaseOrderData {
  orderNumber: string;
  orderDate: Date | string;
  expectedDelivery: Date | string;
  supplier: {
    name: string;
    address: string;
    contact: string;
    email: string;
  };
  buyer: {
    company: string;
    department: string;
    contact: string;
    address: string;
  };
  items: Array<{
    itemCode: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  paymentTerms?: string;
  deliveryInstructions?: string;
  approvedBy?: string;
}

// ============================================================================
// Step 2: Create Your Template Component
// ============================================================================

@Component({
  selector: 'app-purchase-order-print',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Use the container classes from base component -->
    <div [class]="getContainerClasses().join(' ')" [attr.dir]="isRtl() ? 'rtl' : 'ltr'">
      
      <!-- Watermark (optional) -->
      <div class="watermark" *ngIf="watermark()">{{ watermark() }}</div>

      <!-- Header Section -->
      <div class="po-header">
        <div class="header-row">
          <div class="header-left">
            <h1 class="po-title">PURCHASE ORDER</h1>
            <div class="po-number">PO #: {{ data.orderNumber }}</div>
          </div>
          <div class="header-right">
            <div class="date-info">
              <span class="label">Date:</span>
              <span class="value">{{ formatDate(data.orderDate) }}</span>
            </div>
            <div class="date-info">
              <span class="label">Expected Delivery:</span>
              <span class="value">{{ formatDate(data.expectedDelivery) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Parties Information -->
      <div class="parties-section">
        <div class="party-box">
          <h3>Supplier</h3>
          <p class="party-name">{{ data.supplier.name }}</p>
          <p>{{ data.supplier.address }}</p>
          <p>Contact: {{ data.supplier.contact }}</p>
          <p>Email: {{ data.supplier.email }}</p>
        </div>
        
        <div class="party-box">
          <h3>Bill To</h3>
          <p class="party-name">{{ data.buyer.company }}</p>
          <p>{{ data.buyer.department }}</p>
          <p>{{ data.buyer.address }}</p>
          <p>Contact: {{ data.buyer.contact }}</p>
        </div>
      </div>

      <!-- Items Table -->
      <div class="items-section">
        <table class="po-table">
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of data.items">
              <td>{{ item.itemCode }}</td>
              <td>{{ item.description }}</td>
              <td class="text-center">{{ item.quantity }}</td>
              <td class="text-right">{{ formatCurrency(item.unitPrice, data.currency) }}</td>
              <td class="text-right">{{ formatCurrency(item.total, data.currency) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totals Section -->
      <div class="totals-section">
        <div class="totals-table">
          <div class="total-row">
            <span class="label">Subtotal:</span>
            <span class="value">{{ formatCurrency(data.subtotal, data.currency) }}</span>
          </div>
          <div class="total-row">
            <span class="label">Tax:</span>
            <span class="value">{{ formatCurrency(data.tax, data.currency) }}</span>
          </div>
          <div class="total-row">
            <span class="label">Shipping:</span>
            <span class="value">{{ formatCurrency(data.shipping, data.currency) }}</span>
          </div>
          <div class="total-row grand-total">
            <span class="label">Total:</span>
            <span class="value">{{ formatCurrency(data.total, data.currency) }}</span>
          </div>
        </div>
      </div>

      <!-- Terms and Instructions -->
      <div class="terms-section" *ngIf="data.paymentTerms || data.deliveryInstructions">
        <div class="terms-box" *ngIf="data.paymentTerms">
          <h4>Payment Terms</h4>
          <p>{{ data.paymentTerms }}</p>
        </div>
        
        <div class="terms-box" *ngIf="data.deliveryInstructions">
          <h4>Delivery Instructions</h4>
          <p>{{ data.deliveryInstructions }}</p>
        </div>
      </div>

      <!-- Approval Section -->
      <div class="approval-section" *ngIf="data.approvedBy">
        <div class="approval-line">
          <span class="label">Approved by:</span>
          <span class="value">{{ data.approvedBy }}</span>
        </div>
        <div class="approval-line">
          <span class="label">Date:</span>
          <span class="value">{{ getCurrentDate() }}</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="po-footer" *ngIf="showFooter()">
        <p>This is a computer-generated purchase order. No signature required.</p>
        <p class="generated">Generated on {{ getCurrentDateTime() }}</p>
      </div>
    </div>
  `,
  styles: [`
    /* Custom styles for Purchase Order template */
    
    .po-header {
      border-bottom: 3px solid #2c3e50;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .po-title {
      font-size: 32pt;
      font-weight: 700;
      color: #2c3e50;
      margin: 0;
    }

    .po-number {
      font-size: 14pt;
      font-weight: 600;
      color: #3498db;
      margin-top: 5px;
    }

    .date-info {
      display: flex;
      justify-content: space-between;
      margin: 5px 0;
      gap: 20px;
    }

    .date-info .label {
      font-weight: 600;
      color: #7f8c8d;
    }

    .parties-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }

    .party-box {
      padding: 15px;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      background: #f8f9fa;
    }

    .party-box h3 {
      margin: 0 0 10px 0;
      color: #2c3e50;
      font-size: 12pt;
      text-transform: uppercase;
    }

    .party-box p {
      margin: 5px 0;
      font-size: 10pt;
    }

    .party-name {
      font-weight: 700;
      font-size: 11pt !important;
      color: #2c3e50;
    }

    .items-section {
      margin: 30px 0;
    }

    .po-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #dee2e6;
    }

    .po-table thead {
      background: #34495e;
      color: white;
    }

    .po-table th {
      padding: 12px;
      text-align: left;
      font-size: 10pt;
      font-weight: 600;
    }

    .po-table tbody tr {
      border-bottom: 1px solid #dee2e6;
    }

    .po-table tbody tr:nth-child(even) {
      background: #f8f9fa;
    }

    .po-table td {
      padding: 10px 12px;
      font-size: 10pt;
    }

    .totals-section {
      display: flex;
      justify-content: flex-end;
      margin: 30px 0;
    }

    .totals-table {
      min-width: 300px;
      border: 1px solid #dee2e6;
      background: #f8f9fa;
      padding: 15px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #dee2e6;
    }

    .total-row.grand-total {
      border-top: 2px solid #2c3e50;
      border-bottom: none;
      margin-top: 10px;
      padding-top: 12px;
      font-size: 14pt;
      font-weight: 700;
      color: #2c3e50;
    }

    .terms-section {
      margin: 30px 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .terms-box {
      padding: 15px;
      border-left: 4px solid #3498db;
      background: #f8f9fa;
    }

    .terms-box h4 {
      margin: 0 0 10px 0;
      color: #2c3e50;
      font-size: 11pt;
    }

    .terms-box p {
      margin: 0;
      font-size: 10pt;
      line-height: 1.6;
    }

    .approval-section {
      margin: 40px 0 20px 0;
      padding: 20px;
      border-top: 2px solid #dee2e6;
    }

    .approval-line {
      display: flex;
      gap: 20px;
      margin: 10px 0;
    }

    .approval-line .label {
      font-weight: 600;
      color: #7f8c8d;
      min-width: 120px;
    }

    .po-footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #dee2e6;
      text-align: center;
      font-size: 9pt;
      color: #7f8c8d;
    }

    .po-footer .generated {
      font-size: 8pt;
      margin-top: 5px;
    }

    @media print {
      .parties-section,
      .terms-section {
        page-break-inside: avoid;
      }

      .po-table tbody tr {
        page-break-inside: avoid;
      }
    }
  `],
  // Include base styles
  styleUrls: ['../src/app/shared/print-templates/base/base-print-template.component.scss']
})
export class PurchaseOrderPrintComponent extends BasePrintTemplateComponent {
  /**
   * Type-safe data input
   */
  @Input({ required: true }) override data!: PurchaseOrderData;

  /**
   * Add any custom methods specific to your template
   */
  getOrderStatus(): string {
    const today = new Date();
    const deliveryDate = new Date(this.data.expectedDelivery);
    
    if (deliveryDate < today) {
      return 'Overdue';
    } else if (deliveryDate.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return 'Urgent';
    }
    return 'Normal';
  }
}

// ============================================================================
// Step 3: Register Your Template
// ============================================================================

/**
 * Add this to your app.config.ts or registration file:
 * 
 * export function registerPrintTemplates(printService: PrintService): () => void {
 *   return () => {
 *     // ... existing registrations
 *     printService.registerTemplate(
 *       'purchase-order', 
 *       PurchaseOrderPrintComponent,
 *       'Purchase order template'
 *     );
 *   };
 * }
 */

// ============================================================================
// Step 4: Use Your Template
// ============================================================================

/**
 * Example usage in a component:
 * 
 * async printPurchaseOrder(): Promise<void> {
 *   const poData: PurchaseOrderData = {
 *     orderNumber: 'PO-2024-001',
 *     orderDate: new Date(),
 *     expectedDelivery: new Date('2024-12-25'),
 *     supplier: {
 *       name: 'ABC Supplies Inc.',
 *       address: '123 Supplier St, City, Country',
 *       contact: 'John Supplier',
 *       email: 'john@abcsupplies.com'
 *     },
 *     buyer: {
 *       company: 'Your Company Inc.',
 *       department: 'Procurement',
 *       contact: 'Jane Buyer',
 *       address: '456 Buyer Ave, City, Country'
 *     },
 *     items: [
 *       {
 *         itemCode: 'ITEM-001',
 *         description: 'Office Supplies - Premium Pack',
 *         quantity: 10,
 *         unitPrice: 50,
 *         total: 500
 *       },
 *       {
 *         itemCode: 'ITEM-002',
 *         description: 'Computer Equipment',
 *         quantity: 5,
 *         unitPrice: 1200,
 *         total: 6000
 *       }
 *     ],
 *     subtotal: 6500,
 *     tax: 650,
 *     shipping: 150,
 *     total: 7300,
 *     currency: 'USD',
 *     paymentTerms: 'Net 30 days from delivery date',
 *     deliveryInstructions: 'Please deliver to receiving dock during business hours (9am-5pm)',
 *     approvedBy: 'Jane Buyer - Procurement Manager'
 *   };
 * 
 *   await this.printService.preview({
 *     templateKey: 'purchase-order',
 *     data: poData,
 *     options: {
 *       pageSize: 'A4',
 *       orientation: 'portrait',
 *       title: 'Purchase Order'
 *     }
 *   });
 * }
 */

