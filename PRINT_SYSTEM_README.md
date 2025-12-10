# Print System Documentation

A complete, production-ready print system for Angular 17+ applications with standalone components. This system provides a generic, reusable architecture for printing different types of documents including invoices, reports, and data tables.

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
- [Creating Custom Templates](#creating-custom-templates)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- **Generic & Reusable**: Template registry system for managing multiple print templates
- **Type-Safe**: Full TypeScript support with strong typing throughout
- **Standalone Components**: Built with Angular 17+ standalone architecture
- **Print Preview**: Modal dialog preview before printing using Angular CDK
- **Multiple Templates**: Built-in templates for invoices, reports, and tables
- **Customizable**: Easy to create and register custom print templates
- **Page Formats**: Support for A4, Letter, and Legal page sizes
- **Orientations**: Portrait and landscape orientations
- **RTL Support**: Right-to-left language support (Arabic, Hebrew, etc.)
- **Professional Styling**: Print-optimized CSS with proper page breaks
- **No Dependencies**: Uses native `window.print()` - no external PDF libraries
- **Production Ready**: Error handling, loading states, and proper cleanup

## 📦 Installation

### 1. Install Required Dependencies

```bash
npm install @angular/cdk
```

### 2. Copy Files to Your Project

Copy the following directory structure to your Angular project:

```
src/app/
├── core/
│   └── services/
│       └── print.service.ts
├── shared/
│   ├── components/
│   │   └── print-preview/
│   │       ├── print-preview.component.ts
│   │       ├── print-preview.component.html
│   │       ├── print-preview.component.scss
│   │       └── print-preview.component.print.scss
│   ├── models/
│   │   └── print.models.ts
│   └── print-templates/
│       ├── base/
│       │   ├── base-print-template.component.ts
│       │   └── base-print-template.component.scss
│       ├── invoice/
│       │   ├── invoice-print.component.ts
│       │   ├── invoice-print.component.html
│       │   └── invoice-print.component.scss
│       ├── report/
│       │   ├── report-print.component.ts
│       │   ├── report-print.component.html
│       │   └── report-print.component.scss
│       ├── table/
│       │   ├── table-print.component.ts
│       │   ├── table-print.component.html
│       │   └── table-print.component.scss
│       └── index.ts
└── styles/
    └── print-global.scss
```

### 3. Configure angular.json

Add the global print styles to your `angular.json`:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "src/styles.scss",
              "src/app/styles/print-global.scss"
            ]
          }
        }
      }
    }
  }
}
```

### 4. Register Templates

Update your `app.config.ts` (or `main.ts` for older Angular versions):

```typescript
import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { PrintService } from './core/services/print.service';
import { 
  InvoicePrintComponent,
  ReportPrintComponent,
  TablePrintComponent
} from './shared/print-templates';

export function registerPrintTemplates(printService: PrintService): () => void {
  return () => {
    printService.registerTemplate('invoice', InvoicePrintComponent);
    printService.registerTemplate('report', ReportPrintComponent);
    printService.registerTemplate('table', TablePrintComponent);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    {
      provide: APP_INITIALIZER,
      useFactory: registerPrintTemplates,
      deps: [PrintService],
      multi: true
    }
  ]
};
```

## 🏗️ Architecture

### Component Hierarchy

```
PrintService (Registry & Orchestration)
    ↓
PrintPreviewComponent (Modal Dialog)
    ↓
Dynamic Template Loading (CDK Portal)
    ↓
BasePrintTemplateComponent (Abstract Base)
    ↓
Concrete Templates (Invoice, Report, Table)
```

### Data Flow

1. **Component** calls `printService.preview(config)`
2. **PrintService** validates template exists in registry
3. **PrintPreviewComponent** opens as a modal dialog
4. **Dynamic Loading** creates template component via CDK Portal
5. **Template** receives data and renders content
6. **User** clicks print button
7. **Browser** shows native print dialog

## 🚀 Quick Start

### Example Component

```typescript
import { Component, inject } from '@angular/core';
import { PrintService } from './core/services/print.service';
import { InvoiceData } from './shared/models/print.models';

@Component({
  selector: 'app-invoice-view',
  template: `
    <button (click)="printInvoice()">Print Invoice</button>
  `
})
export class InvoiceViewComponent {
  private printService = inject(PrintService);

  async printInvoice(): Promise<void> {
    const invoiceData: InvoiceData = {
      invoiceNumber: 'INV-2024-001',
      invoiceDate: new Date(),
      dueDate: new Date('2024-12-31'),
      customer: {
        name: 'Acme Corporation',
        address: '123 Business St',
        city: 'New York',
        country: 'USA',
        email: 'billing@acme.com',
        phone: '+1 (555) 123-4567'
      },
      company: {
        name: 'Your Company',
        logo: 'assets/logo.png',
        address: '456 Commerce Ave',
        taxId: 'TAX-123456',
        email: 'info@yourcompany.com',
        phone: '+1 (555) 987-6543'
      },
      items: [
        {
          description: 'Web Development Services',
          quantity: 40,
          unitPrice: 150,
          total: 6000
        },
        {
          description: 'Design Consultation',
          quantity: 10,
          unitPrice: 100,
          total: 1000
        }
      ],
      subtotal: 7000,
      tax: 700,
      total: 7700,
      currency: 'USD',
      notes: 'Thank you for your business!',
      paymentTerms: 'Payment due within 30 days'
    };

    try {
      await this.printService.preview({
        templateKey: 'invoice',
        data: invoiceData,
        options: {
          pageSize: 'A4',
          orientation: 'portrait',
          showHeader: true,
          showFooter: true,
          title: 'Invoice'
        }
      });
    } catch (error) {
      console.error('Print failed:', error);
    }
  }
}
```

## 📚 Usage Examples

### 1. Printing an Invoice

```typescript
async printInvoice(): Promise<void> {
  const invoiceData: InvoiceData = {
    invoiceNumber: 'INV-2024-001',
    invoiceDate: new Date(),
    dueDate: new Date('2024-12-31'),
    customer: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      country: 'USA',
      email: 'john@example.com'
    },
    company: {
      name: 'Your Company',
      logo: 'assets/logo.png',
      address: '456 Business Ave'
    },
    items: [
      {
        description: 'Product A',
        quantity: 2,
        unitPrice: 50,
        total: 100
      }
    ],
    subtotal: 100,
    tax: 10,
    total: 110,
    currency: 'USD'
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
```

### 2. Printing a Report

```typescript
async printReport(): Promise<void> {
  const reportData: ReportData = {
    title: 'Monthly Sales Report',
    subtitle: 'December 2024',
    reportDate: new Date(),
    reportPeriod: 'December 1-31, 2024',
    generatedBy: 'John Doe',
    company: {
      name: 'Your Company',
      logo: 'assets/logo.png'
    },
    sections: [
      {
        title: 'Executive Summary',
        content: 'This report summarizes the sales performance for December 2024...',
        pageBreakAfter: false
      },
      {
        title: 'Sales by Region',
        subsections: [
          {
            title: 'North America',
            content: 'Sales in North America increased by 15%...',
            data: [
              { region: 'USA', sales: 150000, growth: '12%' },
              { region: 'Canada', sales: 45000, growth: '8%' }
            ]
          }
        ]
      },
      {
        title: 'Detailed Analysis',
        data: [
          { month: 'January', revenue: 50000, expenses: 30000, profit: 20000 },
          { month: 'February', revenue: 55000, expenses: 32000, profit: 23000 }
        ]
      }
    ],
    summary: {
      title: 'Key Metrics',
      items: [
        { label: 'Total Revenue', value: '$1.2M', highlight: true },
        { label: 'Total Profit', value: '$450K', highlight: true },
        { label: 'Growth Rate', value: '15%', highlight: false }
      ]
    },
    footer: 'Confidential - Internal Use Only'
  };

  await this.printService.preview({
    templateKey: 'report',
    data: reportData,
    options: {
      pageSize: 'A4',
      orientation: 'portrait',
      title: 'Sales Report'
    }
  });
}
```

### 3. Printing a Data Table

```typescript
async printTable(): Promise<void> {
  const tableData: TableData = {
    title: 'Customer List',
    subtitle: 'Active Customers - 2024',
    company: {
      name: 'Your Company',
      logo: 'assets/logo.png'
    },
    columns: [
      { field: 'id', header: 'ID', width: '80px', align: 'center' },
      { field: 'name', header: 'Customer Name', width: '200px' },
      { field: 'email', header: 'Email', width: '180px' },
      { 
        field: 'revenue', 
        header: 'Revenue', 
        width: '120px', 
        align: 'right',
        format: (value) => `$${value.toLocaleString()}`
      },
      { 
        field: 'status', 
        header: 'Status', 
        width: '100px', 
        align: 'center' 
      }
    ],
    rows: [
      { id: 1, name: 'Acme Corp', email: 'contact@acme.com', revenue: 150000, status: 'Active' },
      { id: 2, name: 'TechStart', email: 'info@techstart.com', revenue: 89000, status: 'Active' },
      { id: 3, name: 'Global Inc', email: 'hello@global.com', revenue: 250000, status: 'Active' }
    ],
    filters: [
      { label: 'Status', value: 'Active' },
      { label: 'Year', value: '2024' }
    ],
    summary: [
      { label: 'Total Customers', value: '3' },
      { label: 'Total Revenue', value: '$489,000' },
      { label: 'Average Revenue', value: '$163,000' }
    ],
    showRowNumbers: true,
    totalRecords: 3,
    generatedDate: new Date()
  };

  await this.printService.preview({
    templateKey: 'table',
    data: tableData,
    options: {
      pageSize: 'A4',
      orientation: 'landscape',
      title: 'Customer Data'
    }
  });
}
```

### 4. Direct Printing (Without Preview)

```typescript
async printDirectly(): Promise<void> {
  await this.printService.printDirect({
    templateKey: 'invoice',
    data: invoiceData,
    options: { pageSize: 'A4' }
  });
}
```

### 5. RTL Support (Arabic/Hebrew)

```typescript
await this.printService.preview({
  templateKey: 'invoice',
  data: invoiceData,
  options: {
    rtl: true,
    title: 'فاتورة',
    pageSize: 'A4'
  }
});
```

### 6. Custom Page Size and Watermark

```typescript
await this.printService.preview({
  templateKey: 'report',
  data: reportData,
  options: {
    pageSize: 'Legal',
    orientation: 'landscape',
    watermark: 'CONFIDENTIAL',
    showPageNumbers: true
  }
});
```

## 🎨 Creating Custom Templates

### Step 1: Create Template Component

```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePrintTemplateComponent } from '../base/base-print-template.component';

interface CustomData {
  title: string;
  content: string;
}

@Component({
  selector: 'app-custom-print',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getContainerClasses().join(' ')">
      <h1>{{ data.title }}</h1>
      <p>{{ data.content }}</p>
      <p>Generated: {{ getCurrentDateTime() }}</p>
    </div>
  `,
  styleUrls: ['../base/base-print-template.component.scss']
})
export class CustomPrintComponent extends BasePrintTemplateComponent {
  @Input({ required: true }) override data!: CustomData;
}
```

### Step 2: Register Template

```typescript
export function registerPrintTemplates(printService: PrintService): () => void {
  return () => {
    // ... existing registrations
    printService.registerTemplate('custom', CustomPrintComponent, 'Custom template');
  };
}
```

### Step 3: Use Template

```typescript
await this.printService.preview({
  templateKey: 'custom',
  data: { title: 'My Document', content: 'Hello World' }
});
```

## 📖 API Reference

### PrintService

#### Methods

##### `registerTemplate(key: string, component: Type<any>, description?: string): void`
Register a new print template.

```typescript
printService.registerTemplate('invoice', InvoicePrintComponent, 'Invoice template');
```

##### `getTemplate(key: string): PrintTemplate | undefined`
Retrieve a registered template.

```typescript
const template = printService.getTemplate('invoice');
```

##### `getRegisteredTemplates(): string[]`
Get all registered template keys.

```typescript
const keys = printService.getRegisteredTemplates();
// ['invoice', 'report', 'table']
```

##### `hasTemplate(key: string): boolean`
Check if a template is registered.

```typescript
if (printService.hasTemplate('invoice')) {
  // Template exists
}
```

##### `preview(config: PrintConfig): Promise<void>`
Open print preview modal.

```typescript
await printService.preview({
  templateKey: 'invoice',
  data: invoiceData,
  options: { pageSize: 'A4' }
});
```

##### `printDirect(config: PrintConfig): Promise<void>`
Print without preview.

```typescript
await printService.printDirect({
  templateKey: 'invoice',
  data: invoiceData
});
```

##### `print(): void`
Trigger native print dialog (called internally).

```typescript
printService.print();
```

##### `closePreview(): void`
Close the active preview dialog.

```typescript
printService.closePreview();
```

### PrintConfig Interface

```typescript
interface PrintConfig {
  templateKey: string;      // Template identifier
  data: any;               // Data for the template
  options?: PrintOptions;  // Optional print settings
}
```

### PrintOptions Interface

```typescript
interface PrintOptions {
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'A4' | 'Letter' | 'Legal';
  showHeader?: boolean;
  showFooter?: boolean;
  showPageNumbers?: boolean;
  title?: string;
  headerData?: Record<string, any>;
  footerData?: Record<string, any>;
  rtl?: boolean;
  watermark?: string;
  copies?: number;
}
```

### BasePrintTemplateComponent

#### Properties

- `data: any` - Template data (input)
- `options?: PrintOptions` - Print options (input)

#### Methods

- `getCurrentDate(): string` - Get formatted current date
- `getCurrentTime(): string` - Get formatted current time
- `getCurrentDateTime(): string` - Get formatted date and time
- `formatDate(date, format?): string` - Format a date
- `formatCurrency(value, currency, locale?): string` - Format currency
- `formatNumber(value, decimals?, locale?): string` - Format number
- `getContainerClasses(): string[]` - Get CSS classes for container

#### Computed Properties

- `showHeader()` - Whether to show header
- `showFooter()` - Whether to show footer
- `pageSize()` - Current page size
- `orientation()` - Current orientation
- `isRtl()` - RTL mode flag
- `title()` - Document title
- `watermark()` - Watermark text

## ⚙️ Configuration

### Page Sizes

- **A4**: 210mm × 297mm
- **Letter**: 8.5in × 11in
- **Legal**: 8.5in × 14in

### Default Options

```typescript
{
  orientation: 'portrait',
  pageSize: 'A4',
  showHeader: true,
  showFooter: true,
  showPageNumbers: false,
  title: 'Document',
  rtl: false,
  copies: 1
}
```

### Browser Print Settings

The system uses `window.print()` which opens the browser's native print dialog. Users can:
- Choose printer
- Select page range
- Adjust margins
- Set number of copies
- Save as PDF

## 📋 Best Practices

### 1. Data Preparation

```typescript
// ✅ Good: Prepare data before printing
const data = this.prepareInvoiceData(rawData);
await this.printService.preview({ templateKey: 'invoice', data });

// ❌ Bad: Pass raw API response
await this.printService.preview({ 
  templateKey: 'invoice', 
  data: apiResponse 
});
```

### 2. Error Handling

```typescript
try {
  await this.printService.preview(config);
} catch (error) {
  console.error('Print failed:', error);
  this.showErrorMessage('Unable to print document');
}
```

### 3. Loading States

```typescript
this.isPrinting = true;
try {
  await this.printService.preview(config);
} finally {
  this.isPrinting = false;
}
```

### 4. Template Registration

```typescript
// ✅ Good: Register in APP_INITIALIZER
{
  provide: APP_INITIALIZER,
  useFactory: registerPrintTemplates,
  deps: [PrintService],
  multi: true
}

// ❌ Bad: Register in component constructor
constructor(private printService: PrintService) {
  this.printService.registerTemplate('invoice', InvoicePrintComponent);
}
```

### 5. Page Breaks

```html
<!-- Use page break utilities -->
<div class="section avoid-break">
  <!-- Content that should stay together -->
</div>

<div class="page-break"></div>

<div class="next-section">
  <!-- Content on next page -->
</div>
```

### 6. Print-Specific Styles

```scss
// Regular styles
.my-element {
  color: blue;
}

// Print-specific styles
@media print {
  .my-element {
    color: black;
    font-size: 12pt;
  }
}
```

## 🔧 Troubleshooting

### Issue: Template Not Found

**Error**: `Print template 'invoice' not found`

**Solution**: Ensure template is registered in `APP_INITIALIZER`

```typescript
{
  provide: APP_INITIALIZER,
  useFactory: registerPrintTemplates,
  deps: [PrintService],
  multi: true
}
```

### Issue: Colors Not Printing

**Problem**: Colors appear as black/white when printed

**Solution**: Ensure color adjustment is enabled (already included in global styles)

```scss
@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
```

### Issue: Page Breaks Not Working

**Problem**: Content breaks in wrong places

**Solution**: Use page break utilities

```html
<div class="avoid-break">Content to keep together</div>
<div class="page-break"></div>
<div class="next-content">Content on next page</div>
```

### Issue: Dialog Chrome Visible When Printing

**Problem**: Preview header/buttons appear in print output

**Solution**: Use `.no-print` class (already applied in components)

```html
<div class="preview-header no-print">
  <!-- This won't print -->
</div>
```

### Issue: Slow Preview Loading

**Problem**: Preview takes too long to open

**Solution**:
1. Reduce data size
2. Optimize images (compress, use appropriate sizes)
3. Lazy load print preview component

### Issue: Images Not Loading

**Problem**: Images don't appear in print preview

**Solution**:
1. Use absolute URLs or assets from Angular assets folder
2. Ensure images are accessible
3. Check CORS for external images

```typescript
// ✅ Good
logo: 'assets/images/logo.png'
logo: 'https://yourdomain.com/logo.png'

// ❌ Bad
logo: '../../../assets/logo.png'
```

### Issue: Margins Too Large/Small

**Problem**: Print margins not suitable

**Solution**: Adjust `@page` margins in print styles

```scss
@media print {
  @page {
    margin: 10mm; // Adjust as needed
  }
}
```

### Issue: Table Headers Not Repeating

**Problem**: Table headers only on first page

**Solution**: Use `display: table-header-group` (already included)

```scss
@media print {
  thead {
    display: table-header-group !important;
  }
}
```

## 🎯 Advanced Topics

### Custom Formatting Functions

```typescript
const columns: TableColumn[] = [
  {
    field: 'date',
    header: 'Date',
    format: (value) => new Date(value).toLocaleDateString()
  },
  {
    field: 'amount',
    header: 'Amount',
    format: (value, row) => {
      const currency = row.currency || 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
      }).format(value);
    }
  }
];
```

### Dynamic Template Selection

```typescript
async printDocument(type: string, data: any): Promise<void> {
  const templateMap: Record<string, string> = {
    'invoice': 'invoice',
    'quote': 'invoice', // Reuse invoice template
    'report': 'report',
    'data': 'table'
  };

  const templateKey = templateMap[type];
  if (!this.printService.hasTemplate(templateKey)) {
    throw new Error(`Template for type '${type}' not available`);
  }

  await this.printService.preview({ templateKey, data });
}
```

### Conditional Sections

```html
<div *ngIf="data.showSummary" class="summary-section">
  <!-- Summary content -->
</div>

<ng-container *ngIf="data.items.length > 10">
  <div class="page-break"></div>
</ng-container>
```

## 📊 Performance Tips

1. **Lazy Load Preview Component**: Already implemented with dynamic import
2. **Optimize Images**: Compress and resize before passing to templates
3. **Limit Data Size**: Paginate large datasets
4. **Use Virtual Scrolling**: For preview of very large tables (not for print)
5. **Cache Formatted Values**: Pre-format data before passing to template

## 🌐 Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📝 License

This print system is provided as-is for use in your projects.

## 🤝 Support

For issues, questions, or contributions, please refer to your project's issue tracker.

---

**Built with ❤️ using Angular 17+ and TypeScript**

