import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PrintService } from './core/services/print.service';
import { InvoiceData, ReportData, TableData, TableColumn } from './shared/models/print.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private printService = inject(PrintService);
  
  title = 'Print System Demo';
  isLoading = false;
  message = '';
  messageType: 'success' | 'error' | 'info' = 'info';

  /**
   * Print a sample invoice
   */
  async printInvoice(): Promise<void> {
    this.setLoading('Preparing invoice...');

    console.log('Print invoice clicked');
    console.log('Registered templates:', this.printService.getRegisteredTemplates());
    console.log('Has invoice template:', this.printService.hasTemplate('invoice'));

    try {
      const invoiceData: InvoiceData = {
        invoiceNumber: 'INV-2024-001',
        invoiceDate: new Date('2024-12-10'),
        dueDate: new Date('2025-01-10'),
        customer: {
          name: 'Acme Corporation',
          address: '123 Business Street, Suite 100',
          city: 'New York',
          country: 'USA',
          email: 'billing@acmecorp.com',
          phone: '+1 (555) 123-4567'
        },
        company: {
          name: 'Your Company Inc.',
          logo: 'https://via.placeholder.com/200x80?text=Your+Company',
          address: '456 Commerce Avenue',
          city: 'Los Angeles',
          country: 'USA',
          taxId: 'TAX-123456789',
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
            description: 'UI/UX Design Consultation',
            quantity: 10,
            unitPrice: 150,
            total: 1500
          },
          {
            description: 'Cloud Hosting & Maintenance (Annual)',
            quantity: 1,
            unitPrice: 1200,
            total: 1200
          },
          {
            description: 'SSL Certificate & Security',
            quantity: 1,
            unitPrice: 500,
            total: 500
          }
        ],
        subtotal: 9200,
        tax: 920,
        total: 10120,
        currency: 'USD',
        notes: 'Thank you for your business! We appreciate your prompt payment.',
        paymentTerms: 'Payment is due within 30 days. Late payments may incur a 2% monthly fee. Please include invoice number with payment.'
      };

      await this.printService.preview({
        templateKey: 'invoice',
        data: invoiceData,
        options: {
          pageSize: 'A4',
          orientation: 'portrait',
          title: 'Invoice',
          showHeader: true,
          showFooter: true
        }
      });

      this.setMessage('Invoice preview opened successfully!', 'success');
    } catch (error: any) {
      this.setMessage(`Error: ${error.message}`, 'error');
      console.error('Print error:', error);
    }
  }

  /**
   * Print a sample report
   */
  async printReport(): Promise<void> {
    this.setLoading('Preparing report...');

    try {
      const reportData: ReportData = {
        title: 'Monthly Sales Analysis Report',
        subtitle: 'December 2024 Performance Review',
        reportDate: new Date(),
        reportPeriod: 'December 1-31, 2024',
        generatedBy: 'Sales Analytics Team',
        company: {
          name: 'Your Company Inc.',
          logo: 'https://via.placeholder.com/200x80?text=Your+Company',
          address: '456 Commerce Avenue, Los Angeles, CA',
          email: 'analytics@yourcompany.com',
          phone: '+1 (555) 987-6543'
        },
        sections: [
          {
            title: 'Executive Summary',
            content: 'December 2024 has been an exceptional month for sales, with record-breaking numbers across all product categories. Our total revenue reached $1.2M, representing a 15% increase compared to the previous quarter. This growth was driven primarily by strong performance in the North American and Asia Pacific regions.',
            pageBreakAfter: false
          },
          {
            title: 'Sales Performance by Region',
            content: 'Regional analysis shows consistent growth across all markets:',
            subsections: [
              {
                title: 'North America',
                content: 'North American sales exceeded targets by 18%, with particularly strong performance in the enterprise segment.',
                data: [
                  { country: 'United States', revenue: 350000, growth: '20%', customers: 145 },
                  { country: 'Canada', revenue: 100000, growth: '12%', customers: 42 }
                ]
              },
              {
                title: 'Europe',
                content: 'European markets showed steady growth with increased adoption in mid-market companies.',
                data: [
                  { country: 'United Kingdom', revenue: 180000, growth: '15%', customers: 67 },
                  { country: 'Germany', revenue: 140000, growth: '10%', customers: 53 }
                ]
              },
              {
                title: 'Asia Pacific',
                content: 'Asia Pacific region demonstrated the highest growth rate of 25%, driven by expansion in emerging markets.',
                data: [
                  { country: 'Australia', revenue: 150000, growth: '22%', customers: 38 },
                  { country: 'Singapore', revenue: 130000, growth: '28%', customers: 31 }
                ]
              }
            ]
          },
          {
            title: 'Top Performing Products',
            data: [
              { product: 'Enterprise Suite', unitsSold: 1250, revenue: 625000, margin: '45%' },
              { product: 'Professional Package', unitsSold: 2100, revenue: 420000, margin: '38%' },
              { product: 'Starter Plan', unitsSold: 3500, revenue: 175000, margin: '32%' }
            ],
            pageBreakAfter: false
          },
          {
            title: 'Customer Metrics',
            data: {
              newCustomers: 127,
              returningCustomers: 453,
              churnRate: '2.3%',
              customerSatisfaction: '94%',
              averageOrderValue: '$892',
              customerLifetimeValue: '$4,500',
              netPromoterScore: 72
            }
          },
          {
            title: 'Marketing ROI Analysis',
            content: 'Marketing campaigns delivered exceptional returns this month:',
            data: [
              { channel: 'Email Marketing', spend: 15000, revenue: 75000, roi: '400%', conversions: 234 },
              { channel: 'Social Media Ads', spend: 25000, revenue: 100000, roi: '300%', conversions: 412 },
              { channel: 'Search Advertising', spend: 30000, revenue: 120000, roi: '300%', conversions: 567 },
              { channel: 'Content Marketing', spend: 10000, revenue: 45000, roi: '350%', conversions: 189 }
            ]
          }
        ],
        summary: {
          title: 'Key Performance Indicators',
          items: [
            { label: 'Total Revenue', value: '$1.2M', highlight: true },
            { label: 'Gross Profit', value: '$456K', highlight: true },
            { label: 'Profit Margin', value: '38%', highlight: false },
            { label: 'Year-over-Year Growth', value: '15%', highlight: false },
            { label: 'New Customers', value: '127', highlight: false },
            { label: 'Customer Retention', value: '97.7%', highlight: false }
          ]
        },
        footer: 'This report contains proprietary business information. Distribution outside the organization is strictly prohibited.'
      };

      await this.printService.preview({
        templateKey: 'report',
        data: reportData,
        options: {
          pageSize: 'A4',
          orientation: 'portrait',
          title: 'Sales Report',
          showHeader: true,
          showFooter: true
        }
      });

      this.setMessage('Report preview opened successfully!', 'success');
    } catch (error: any) {
      this.setMessage(`Error: ${error.message}`, 'error');
      console.error('Print error:', error);
    }
  }

  /**
   * Print a sample data table
   */
  async printTable(): Promise<void> {
    this.setLoading('Preparing table...');

    try {
      const columns: TableColumn[] = [
        { 
          field: 'id', 
          header: 'ID', 
          width: '60px', 
          align: 'center' 
        },
        { 
          field: 'name', 
          header: 'Customer Name', 
          width: '180px',
          align: 'left'
        },
        { 
          field: 'email', 
          header: 'Email Address', 
          width: '200px',
          align: 'left'
        },
        { 
          field: 'phone', 
          header: 'Phone', 
          width: '120px',
          align: 'left'
        },
        { 
          field: 'revenue', 
          header: 'Total Revenue', 
          width: '120px', 
          align: 'right',
          format: (value: number) => `$${value.toLocaleString()}`
        },
        { 
          field: 'orders', 
          header: 'Orders', 
          width: '80px', 
          align: 'center' 
        },
        { 
          field: 'status', 
          header: 'Status', 
          width: '100px', 
          align: 'center' 
        }
      ];

      const tableData: TableData = {
        title: 'Customer Directory 2024',
        subtitle: 'Active Premium Customers',
        company: {
          name: 'Your Company Inc.',
          logo: 'https://via.placeholder.com/150x60?text=Logo'
        },
        columns: columns,
        rows: [
          { 
            id: 1, 
            name: 'Acme Corporation', 
            email: 'contact@acme.com', 
            phone: '555-0101',
            revenue: 150000,
            orders: 45,
            status: 'Active' 
          },
          { 
            id: 2, 
            name: 'TechStart Solutions', 
            email: 'info@techstart.com', 
            phone: '555-0102',
            revenue: 89000,
            orders: 28,
            status: 'Active' 
          },
          { 
            id: 3, 
            name: 'Global Innovations Inc.', 
            email: 'hello@global.com', 
            phone: '555-0103',
            revenue: 250000,
            orders: 67,
            status: 'Active' 
          },
          { 
            id: 4, 
            name: 'Digital Dynamics LLC', 
            email: 'support@digital.com', 
            phone: '555-0104',
            revenue: 175000,
            orders: 52,
            status: 'Active' 
          },
          { 
            id: 5, 
            name: 'Cloud Systems Pro', 
            email: 'sales@cloudsystems.com', 
            phone: '555-0105',
            revenue: 320000,
            orders: 89,
            status: 'Active' 
          },
          { 
            id: 6, 
            name: 'Data Science Partners', 
            email: 'info@datasci.com', 
            phone: '555-0106',
            revenue: 198000,
            orders: 61,
            status: 'Active' 
          },
          { 
            id: 7, 
            name: 'Enterprise Solutions Ltd', 
            email: 'contact@enterprise.com', 
            phone: '555-0107',
            revenue: 425000,
            orders: 103,
            status: 'Active' 
          },
          { 
            id: 8, 
            name: 'Innovation Hub', 
            email: 'team@innovhub.com', 
            phone: '555-0108',
            revenue: 267000,
            orders: 74,
            status: 'Active' 
          }
        ],
        filters: [
          { label: 'Status', value: 'Active' },
          { label: 'Plan Type', value: 'Premium' },
          { label: 'Region', value: 'All Regions' },
          { label: 'Year', value: '2024' }
        ],
        summary: [
          { label: 'Total Customers', value: '8' },
          { label: 'Combined Revenue', value: '$1,874,000' },
          { label: 'Average Revenue', value: '$234,250' },
          { label: 'Total Orders', value: '519' }
        ],
        showRowNumbers: true,
        totalRecords: 8,
        generatedDate: new Date()
      };

      await this.printService.preview({
        templateKey: 'table',
        data: tableData,
        options: {
          pageSize: 'A4',
          orientation: 'portrait',
          title: 'Customer Data',
          showHeader: true,
          showFooter: true
        }
      });

      this.setMessage('Table preview opened successfully!', 'success');
    } catch (error: any) {
      this.setMessage(`Error: ${error.message}`, 'error');
      console.error('Print error:', error);
    }
  }

  /**
   * Print wide table in landscape orientation
   */
  async printLandscapeTable(): Promise<void> {
    this.setLoading('Preparing landscape table...');

    try {
      const columns: TableColumn[] = [
        { field: 'region', header: 'Region', width: '150px' },
        { field: 'q1', header: 'Q1 2024', width: '100px', align: 'right', format: (v) => `$${v}K` },
        { field: 'q2', header: 'Q2 2024', width: '100px', align: 'right', format: (v) => `$${v}K` },
        { field: 'q3', header: 'Q3 2024', width: '100px', align: 'right', format: (v) => `$${v}K` },
        { field: 'q4', header: 'Q4 2024', width: '100px', align: 'right', format: (v) => `$${v}K` },
        { field: 'total', header: 'Total', width: '120px', align: 'right', format: (v) => `$${v}K` },
        { field: 'growth', header: 'YoY Growth', width: '100px', align: 'center' }
      ];

      const tableData: TableData = {
        title: 'Annual Sales by Region - 2024',
        subtitle: 'Quarterly Performance Breakdown',
        columns: columns,
        rows: [
          { region: 'North America', q1: 450, q2: 480, q3: 510, q4: 550, total: 1990, growth: '+12%' },
          { region: 'Europe', q1: 320, q2: 340, q3: 360, q4: 380, total: 1400, growth: '+8%' },
          { region: 'Asia Pacific', q1: 280, q2: 310, q3: 350, q4: 400, total: 1340, growth: '+22%' },
          { region: 'Latin America', q1: 150, q2: 165, q3: 180, q4: 200, total: 695, growth: '+15%' },
          { region: 'Middle East', q1: 100, q2: 115, q3: 130, q4: 145, total: 490, growth: '+18%' }
        ],
        summary: [
          { label: 'Total Revenue', value: '$5,915K' },
          { label: 'Average Growth', value: '+15%' }
        ],
        showRowNumbers: true
      };

      await this.printService.preview({
        templateKey: 'table',
        data: tableData,
        options: {
          pageSize: 'A4',
          orientation: 'landscape',
          title: 'Regional Sales Data'
        }
      });

      this.setMessage('Landscape table preview opened!', 'success');
    } catch (error: any) {
      this.setMessage(`Error: ${error.message}`, 'error');
      console.error('Print error:', error);
    }
  }

  /**
   * Helper method to set loading state
   */
  private setLoading(message: string): void {
    this.isLoading = true;
    this.message = message;
    this.messageType = 'info';
  }

  /**
   * Helper method to set message
   */
  private setMessage(message: string, type: 'success' | 'error' | 'info'): void {
    this.isLoading = false;
    this.message = message;
    this.messageType = type;
    
    // Clear message after 5 seconds
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  /**
   * Get registered templates count
   */
  getTemplatesCount(): number {
    return this.printService.getRegisteredTemplates().length;
  }

  /**
   * Get list of registered templates
   */
  getTemplatesList(): string {
    return this.printService.getRegisteredTemplates().join(', ');
  }
}
