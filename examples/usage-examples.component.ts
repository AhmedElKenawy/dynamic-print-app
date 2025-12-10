/**
 * Usage Examples Component
 * 
 * Comprehensive examples demonstrating how to use the print system
 * in various scenarios. This component serves as a reference implementation.
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintService } from '../src/app/core/services/print.service';
import { 
  InvoiceData, 
  ReportData, 
  TableData,
  TableColumn 
} from '../src/app/shared/models/print.models';

@Component({
  selector: 'app-usage-examples',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="examples-container">
      <h1>Print System Usage Examples</h1>

      <section class="example-section">
        <h2>1. Invoice Examples</h2>
        <button (click)="printBasicInvoice()" class="btn">
          Print Basic Invoice
        </button>
        <button (click)="printInvoiceWithDiscount()" class="btn">
          Invoice with Discount
        </button>
        <button (click)="printRTLInvoice()" class="btn">
          RTL Invoice (Arabic)
        </button>
      </section>

      <section class="example-section">
        <h2>2. Report Examples</h2>
        <button (click)="printSimpleReport()" class="btn">
          Simple Report
        </button>
        <button (click)="printDetailedReport()" class="btn">
          Detailed Report with Data
        </button>
        <button (click)="printReportLandscape()" class="btn">
          Landscape Report
        </button>
      </section>

      <section class="example-section">
        <h2>3. Table Examples</h2>
        <button (click)="printDataTable()" class="btn">
          Customer Data Table
        </button>
        <button (click)="printTableWithFilters()" class="btn">
          Table with Filters
        </button>
        <button (click)="printLandscapeTable()" class="btn">
          Wide Table (Landscape)
        </button>
      </section>

      <section class="example-section">
        <h2>4. Advanced Features</h2>
        <button (click)="printWithWatermark()" class="btn">
          Document with Watermark
        </button>
        <button (click)="printDirectly()" class="btn">
          Direct Print (No Preview)
        </button>
        <button (click)="printLegalSize()" class="btn">
          Legal Size Document
        </button>
      </section>

      <section class="example-section">
        <h2>5. Error Handling</h2>
        <button (click)="printInvalidTemplate()" class="btn btn-danger">
          Try Invalid Template
        </button>
        <button (click)="printWithErrorHandling()" class="btn">
          Print with Error Handling
        </button>
      </section>

      <div class="status" *ngIf="status">
        {{ status }}
      </div>
    </div>
  `,
  styles: [`
    .examples-container {
      padding: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      color: #1e293b;
      margin-bottom: 30px;
    }

    .example-section {
      margin-bottom: 40px;
      padding: 20px;
      background: #f8fafc;
      border-radius: 8px;
      border-left: 4px solid #3b82f6;
    }

    h2 {
      color: #334155;
      font-size: 20px;
      margin-bottom: 15px;
    }

    .btn {
      display: inline-block;
      margin: 5px;
      padding: 10px 20px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }

    .btn:hover {
      background: #2563eb;
    }

    .btn-danger {
      background: #ef4444;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    .status {
      margin-top: 20px;
      padding: 15px;
      background: #dbeafe;
      border-radius: 6px;
      color: #1e40af;
    }
  `]
})
export class UsageExamplesComponent {
  private printService = inject(PrintService);
  status = '';

  // ========================================================================
  // INVOICE EXAMPLES
  // ========================================================================

  /**
   * Example 1: Basic Invoice
   */
  async printBasicInvoice(): Promise<void> {
    const invoiceData: InvoiceData = {
      invoiceNumber: 'INV-2024-001',
      invoiceDate: new Date('2024-12-10'),
      dueDate: new Date('2025-01-10'),
      customer: {
        name: 'Acme Corporation',
        address: '123 Business Street',
        city: 'New York',
        country: 'USA',
        email: 'billing@acme.com',
        phone: '+1 (555) 123-4567'
      },
      company: {
        name: 'Your Company Inc.',
        logo: 'assets/logo.png',
        address: '456 Commerce Avenue',
        city: 'Los Angeles',
        country: 'USA',
        taxId: 'TAX-123456',
        email: 'info@yourcompany.com',
        phone: '+1 (555) 987-6543',
        website: 'www.yourcompany.com'
      },
      items: [
        {
          description: 'Web Development Services (40 hours)',
          quantity: 1,
          unitPrice: 6000,
          total: 6000
        },
        {
          description: 'Design Consultation',
          quantity: 10,
          unitPrice: 100,
          total: 1000
        },
        {
          description: 'Hosting & Maintenance (Annual)',
          quantity: 1,
          unitPrice: 1200,
          total: 1200
        }
      ],
      subtotal: 8200,
      tax: 820,
      total: 9020,
      currency: 'USD',
      notes: 'Thank you for your business! We appreciate your prompt payment.',
      paymentTerms: 'Payment is due within 30 days. Late payments may incur a 2% monthly fee.'
    };

    await this.printService.preview({
      templateKey: 'invoice',
      data: invoiceData,
      options: {
        pageSize: 'A4',
        orientation: 'portrait',
        title: 'Invoice'
      }
    });
  }

  /**
   * Example 2: Invoice with Discount and Shipping
   */
  async printInvoiceWithDiscount(): Promise<void> {
    const invoiceData: InvoiceData = {
      invoiceNumber: 'INV-2024-002',
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      customer: {
        name: 'TechStart Solutions',
        address: '789 Innovation Drive',
        city: 'San Francisco',
        country: 'USA',
        email: 'accounts@techstart.com'
      },
      company: {
        name: 'Your Company Inc.',
        address: '456 Commerce Avenue'
      },
      items: [
        {
          description: 'Premium Software License',
          quantity: 5,
          unitPrice: 299,
          total: 1495
        }
      ],
      subtotal: 1495,
      discount: 150, // 10% discount
      tax: 134.50,
      shipping: 25,
      total: 1504.50,
      currency: 'USD',
      notes: 'Volume discount applied: 10% off for 5+ licenses'
    };

    await this.printService.preview({
      templateKey: 'invoice',
      data: invoiceData
    });
  }

  /**
   * Example 3: RTL Invoice (Arabic)
   */
  async printRTLInvoice(): Promise<void> {
    const invoiceData: InvoiceData = {
      invoiceNumber: 'INV-2024-003',
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      customer: {
        name: 'شركة التقنية المتقدمة',
        address: 'شارع الملك فهد، حي العليا',
        city: 'الرياض',
        country: 'المملكة العربية السعودية',
        email: 'info@tech.sa'
      },
      company: {
        name: 'شركتك للخدمات',
        address: 'شارع الأعمال 123'
      },
      items: [
        {
          description: 'خدمات استشارية',
          quantity: 10,
          unitPrice: 500,
          total: 5000
        }
      ],
      subtotal: 5000,
      tax: 750,
      total: 5750,
      currency: 'SAR'
    };

    await this.printService.preview({
      templateKey: 'invoice',
      data: invoiceData,
      options: {
        rtl: true,
        title: 'فاتورة'
      }
    });
  }

  // ========================================================================
  // REPORT EXAMPLES
  // ========================================================================

  /**
   * Example 4: Simple Report
   */
  async printSimpleReport(): Promise<void> {
    const reportData: ReportData = {
      title: 'Quarterly Business Review',
      subtitle: 'Q4 2024',
      reportDate: new Date(),
      reportPeriod: 'October - December 2024',
      generatedBy: 'John Doe',
      company: {
        name: 'Your Company Inc.',
        logo: 'assets/logo.png',
        address: '456 Commerce Avenue',
        email: 'info@yourcompany.com'
      },
      sections: [
        {
          title: 'Executive Summary',
          content: 'This report presents the key findings and performance metrics for Q4 2024. Overall, the company has shown strong growth with a 15% increase in revenue compared to the previous quarter.'
        },
        {
          title: 'Key Achievements',
          content: 'Major milestones achieved during this quarter include the launch of two new products, expansion into three new markets, and successful completion of the digital transformation initiative.'
        }
      ],
      summary: {
        title: 'Quarter Highlights',
        items: [
          { label: 'Revenue Growth', value: '15%', highlight: true },
          { label: 'New Customers', value: '127', highlight: true },
          { label: 'Customer Satisfaction', value: '94%', highlight: false }
        ]
      },
      footer: 'Confidential - For Internal Use Only'
    };

    await this.printService.preview({
      templateKey: 'report',
      data: reportData
    });
  }

  /**
   * Example 5: Detailed Report with Data Tables
   */
  async printDetailedReport(): Promise<void> {
    const reportData: ReportData = {
      title: 'Monthly Sales Analysis',
      subtitle: 'December 2024 Performance Report',
      reportDate: new Date(),
      reportPeriod: 'December 1-31, 2024',
      generatedBy: 'Sales Analytics Team',
      company: {
        name: 'Your Company Inc.',
        logo: 'assets/logo.png'
      },
      sections: [
        {
          title: 'Sales Overview',
          content: 'December has been an exceptional month for sales, with record-breaking numbers across all product categories.',
          subsections: [
            {
              title: 'Sales by Region',
              content: 'Regional performance breakdown:',
              data: [
                { region: 'North America', sales: 450000, growth: '18%', target: 400000 },
                { region: 'Europe', sales: 320000, growth: '12%', target: 300000 },
                { region: 'Asia Pacific', sales: 280000, growth: '25%', target: 250000 },
                { region: 'Latin America', sales: 150000, growth: '10%', target: 140000 }
              ]
            },
            {
              title: 'Top Products',
              data: [
                { product: 'Product A', units: 1250, revenue: 187500 },
                { product: 'Product B', units: 980, revenue: 147000 },
                { product: 'Product C', units: 750, revenue: 112500 }
              ]
            }
          ]
        },
        {
          title: 'Customer Metrics',
          pageBreakAfter: false,
          data: {
            newCustomers: 127,
            returningCustomers: 453,
            churnRate: '2.3%',
            averageOrderValue: '$892',
            customerLifetimeValue: '$4,500'
          }
        },
        {
          title: 'Marketing Performance',
          content: 'Marketing campaigns delivered strong ROI this month.',
          data: [
            { channel: 'Email Marketing', spend: 15000, revenue: 75000, roi: '400%' },
            { channel: 'Social Media', spend: 25000, revenue: 100000, roi: '300%' },
            { channel: 'Search Ads', spend: 30000, revenue: 120000, roi: '300%' }
          ]
        }
      ],
      summary: {
        title: 'Key Performance Indicators',
        items: [
          { label: 'Total Revenue', value: '$1.2M', highlight: true },
          { label: 'Gross Profit', value: '$456K', highlight: true },
          { label: 'Profit Margin', value: '38%', highlight: false },
          { label: 'YoY Growth', value: '15%', highlight: false }
        ]
      },
      footer: 'This report contains proprietary information. Do not distribute.'
    };

    await this.printService.preview({
      templateKey: 'report',
      data: reportData,
      options: {
        pageSize: 'A4',
        title: 'Sales Analysis Report'
      }
    });
  }

  /**
   * Example 6: Landscape Report
   */
  async printReportLandscape(): Promise<void> {
    const reportData: ReportData = {
      title: 'Wide Data Analysis Report',
      reportDate: new Date(),
      sections: [
        {
          title: 'Comprehensive Data Table',
          data: [
            { month: 'Jan', revenue: 50000, expenses: 30000, profit: 20000, margin: '40%' },
            { month: 'Feb', revenue: 55000, expenses: 32000, profit: 23000, margin: '42%' },
            { month: 'Mar', revenue: 60000, expenses: 35000, profit: 25000, margin: '42%' }
          ]
        }
      ]
    };

    await this.printService.preview({
      templateKey: 'report',
      data: reportData,
      options: {
        orientation: 'landscape'
      }
    });
  }

  // ========================================================================
  // TABLE EXAMPLES
  // ========================================================================

  /**
   * Example 7: Customer Data Table
   */
  async printDataTable(): Promise<void> {
    const tableData: TableData = {
      title: 'Customer Directory',
      subtitle: 'Active Customers - 2024',
      company: {
        name: 'Your Company Inc.',
        logo: 'assets/logo.png'
      },
      columns: [
        { field: 'id', header: 'ID', width: '60px', align: 'center' },
        { field: 'name', header: 'Customer Name', width: '180px' },
        { field: 'email', header: 'Email Address', width: '200px' },
        { field: 'phone', header: 'Phone', width: '120px' },
        { 
          field: 'revenue', 
          header: 'Total Revenue', 
          width: '120px', 
          align: 'right',
          format: (value) => `$${value.toLocaleString()}`
        },
        { 
          field: 'status', 
          header: 'Status', 
          width: '80px', 
          align: 'center' 
        }
      ],
      rows: [
        { 
          id: 1, 
          name: 'Acme Corporation', 
          email: 'contact@acme.com', 
          phone: '555-0101',
          revenue: 150000, 
          status: 'Active' 
        },
        { 
          id: 2, 
          name: 'TechStart Solutions', 
          email: 'info@techstart.com', 
          phone: '555-0102',
          revenue: 89000, 
          status: 'Active' 
        },
        { 
          id: 3, 
          name: 'Global Innovations Inc.', 
          email: 'hello@global.com', 
          phone: '555-0103',
          revenue: 250000, 
          status: 'Active' 
        },
        { 
          id: 4, 
          name: 'Digital Dynamics', 
          email: 'support@digital.com', 
          phone: '555-0104',
          revenue: 175000, 
          status: 'Active' 
        }
      ],
      summary: [
        { label: 'Total Customers', value: '4' },
        { label: 'Combined Revenue', value: '$664,000' },
        { label: 'Average Revenue', value: '$166,000' }
      ],
      showRowNumbers: true,
      totalRecords: 4,
      generatedDate: new Date()
    };

    await this.printService.preview({
      templateKey: 'table',
      data: tableData,
      options: {
        pageSize: 'A4',
        orientation: 'portrait'
      }
    });
  }

  /**
   * Example 8: Table with Filters
   */
  async printTableWithFilters(): Promise<void> {
    const tableData: TableData = {
      title: 'Filtered Sales Report',
      subtitle: 'Q4 2024 - High Value Customers',
      company: {
        name: 'Your Company Inc.'
      },
      filters: [
        { label: 'Period', value: 'Q4 2024 (Oct-Dec)' },
        { label: 'Region', value: 'North America' },
        { label: 'Revenue Threshold', value: '> $100,000' },
        { label: 'Status', value: 'Active' }
      ],
      columns: [
        { field: 'customer', header: 'Customer', width: '200px' },
        { 
          field: 'revenue', 
          header: 'Revenue', 
          width: '120px', 
          align: 'right',
          format: (value) => `$${value.toLocaleString()}`
        },
        { 
          field: 'orders', 
          header: 'Orders', 
          width: '80px', 
          align: 'center' 
        },
        { 
          field: 'avgOrder', 
          header: 'Avg Order', 
          width: '120px', 
          align: 'right',
          format: (value) => `$${value.toLocaleString()}`
        }
      ],
      rows: [
        { customer: 'Acme Corp', revenue: 150000, orders: 12, avgOrder: 12500 },
        { customer: 'Global Inc', revenue: 250000, orders: 20, avgOrder: 12500 },
        { customer: 'Digital LLC', revenue: 175000, orders: 15, avgOrder: 11667 }
      ],
      summary: [
        { label: 'Total Revenue', value: '$575,000' },
        { label: 'Total Orders', value: '47' }
      ],
      showRowNumbers: false,
      totalRecords: 3
    };

    await this.printService.preview({
      templateKey: 'table',
      data: tableData
    });
  }

  /**
   * Example 9: Wide Table in Landscape
   */
  async printLandscapeTable(): Promise<void> {
    const tableData: TableData = {
      title: 'Comprehensive Sales Data',
      subtitle: 'All Regions - 2024',
      columns: [
        { field: 'region', header: 'Region', width: '150px' },
        { field: 'q1', header: 'Q1', width: '100px', align: 'right', format: (v) => `$${v}K` },
        { field: 'q2', header: 'Q2', width: '100px', align: 'right', format: (v) => `$${v}K` },
        { field: 'q3', header: 'Q3', width: '100px', align: 'right', format: (v) => `$${v}K` },
        { field: 'q4', header: 'Q4', width: '100px', align: 'right', format: (v) => `$${v}K` },
        { field: 'total', header: 'Total', width: '120px', align: 'right', format: (v) => `$${v}K` },
        { field: 'growth', header: 'YoY Growth', width: '100px', align: 'center' }
      ],
      rows: [
        { region: 'North America', q1: 450, q2: 480, q3: 510, q4: 550, total: 1990, growth: '+12%' },
        { region: 'Europe', q1: 320, q2: 340, q3: 360, q4: 380, total: 1400, growth: '+8%' },
        { region: 'Asia Pacific', q1: 280, q2: 310, q3: 350, q4: 400, total: 1340, growth: '+22%' }
      ],
      showRowNumbers: true
    };

    await this.printService.preview({
      templateKey: 'table',
      data: tableData,
      options: {
        orientation: 'landscape',
        pageSize: 'A4'
      }
    });
  }

  // ========================================================================
  // ADVANCED FEATURES
  // ========================================================================

  /**
   * Example 10: Document with Watermark
   */
  async printWithWatermark(): Promise<void> {
    const reportData: ReportData = {
      title: 'Confidential Report',
      subtitle: 'Internal Use Only',
      reportDate: new Date(),
      sections: [
        {
          title: 'Sensitive Information',
          content: 'This document contains confidential company information...'
        }
      ]
    };

    await this.printService.preview({
      templateKey: 'report',
      data: reportData,
      options: {
        watermark: 'CONFIDENTIAL',
        title: 'Confidential Document'
      }
    });
  }

  /**
   * Example 11: Direct Print (No Preview)
   */
  async printDirectly(): Promise<void> {
    this.status = 'Printing directly...';
    
    const invoiceData: InvoiceData = {
      invoiceNumber: 'QUICK-001',
      invoiceDate: new Date(),
      dueDate: new Date(),
      customer: {
        name: 'Quick Print Customer',
        address: '123 Main St',
        city: 'City',
        country: 'Country'
      },
      company: {
        name: 'Your Company',
        address: '456 Business Ave'
      },
      items: [
        { description: 'Service', quantity: 1, unitPrice: 100, total: 100 }
      ],
      subtotal: 100,
      tax: 10,
      total: 110,
      currency: 'USD'
    };

    await this.printService.printDirect({
      templateKey: 'invoice',
      data: invoiceData
    });

    this.status = 'Print dialog opened!';
  }

  /**
   * Example 12: Legal Size Document
   */
  async printLegalSize(): Promise<void> {
    const reportData: ReportData = {
      title: 'Legal Document',
      subtitle: 'Printed on Legal Size Paper',
      reportDate: new Date(),
      sections: [
        {
          title: 'Section 1',
          content: 'This document is formatted for legal size paper (8.5" x 14").'
        }
      ]
    };

    await this.printService.preview({
      templateKey: 'report',
      data: reportData,
      options: {
        pageSize: 'Legal',
        title: 'Legal Size Document'
      }
    });
  }

  // ========================================================================
  // ERROR HANDLING
  // ========================================================================

  /**
   * Example 13: Invalid Template (Error Case)
   */
  async printInvalidTemplate(): Promise<void> {
    try {
      await this.printService.preview({
        templateKey: 'nonexistent-template',
        data: {}
      });
    } catch (error: any) {
      this.status = `Error: ${error.message}`;
      console.error('Expected error:', error);
    }
  }

  /**
   * Example 14: Proper Error Handling
   */
  async printWithErrorHandling(): Promise<void> {
    this.status = 'Printing...';

    try {
      const invoiceData: InvoiceData = {
        invoiceNumber: 'INV-TEST',
        invoiceDate: new Date(),
        dueDate: new Date(),
        customer: {
          name: 'Test Customer',
          address: '123 Test St',
          city: 'Test City',
          country: 'Test Country'
        },
        company: {
          name: 'Test Company',
          address: '456 Test Ave'
        },
        items: [
          { description: 'Test Item', quantity: 1, unitPrice: 100, total: 100 }
        ],
        subtotal: 100,
        tax: 10,
        total: 110,
        currency: 'USD'
      };

      await this.printService.preview({
        templateKey: 'invoice',
        data: invoiceData
      });

      this.status = 'Print preview opened successfully!';
    } catch (error: any) {
      this.status = `Error occurred: ${error.message}`;
      console.error('Print error:', error);
      // Here you could show a user-friendly error message
      // or log the error to your error tracking service
    }
  }
}

