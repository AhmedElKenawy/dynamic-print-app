/**
 * Print Models and Interfaces
 * 
 * Defines all interfaces and types used throughout the print system.
 * This includes configuration, options, template definitions, and data models
 * for each print template type.
 */

import { Type } from '@angular/core';

/**
 * Page size options for printing
 */
export type PageSize = 'A4' | 'Letter' | 'Legal';

/**
 * Page orientation options
 */
export type Orientation = 'portrait' | 'landscape';

/**
 * Print options configuration
 */
export interface PrintOptions {
  /** Page orientation */
  orientation?: Orientation;
  
  /** Page size */
  pageSize?: PageSize;
  
  /** Show header section */
  showHeader?: boolean;
  
  /** Show footer section */
  showFooter?: boolean;
  
  /** Show page numbers */
  showPageNumbers?: boolean;
  
  /** Document title */
  title?: string;
  
  /** Custom header data */
  headerData?: Record<string, any>;
  
  /** Custom footer data */
  footerData?: Record<string, any>;
  
  /** Enable RTL (Right-to-Left) support */
  rtl?: boolean;
  
  /** Watermark text (optional) */
  watermark?: string;
  
  /** Number of copies (for reference, browser handles actual copies) */
  copies?: number;
}

/**
 * Main print configuration passed to the print service
 */
export interface PrintConfig {
  /** Template key to identify which template to use */
  templateKey: string;
  
  /** Data to be passed to the template component */
  data: any;
  
  /** Optional print options */
  options?: PrintOptions;
}

/**
 * Template registration information
 */
export interface PrintTemplate {
  /** Unique key to identify the template */
  key: string;
  
  /** Angular component type */
  component: Type<any>;
  
  /** Optional description of the template */
  description?: string;
}

/**
 * Base interface that all print template components must implement
 */
export interface BasePrintTemplate {
  /** Data input for the template */
  data: any;
  
  /** Print options input */
  options?: PrintOptions;
}

/**
 * Invoice-specific data models
 */

export interface InvoiceCustomer {
  name: string;
  address: string;
  city: string;
  country: string;
  email?: string;
  phone?: string;
}

export interface InvoiceCompany {
  name: string;
  logo?: string;
  address: string;
  city?: string;
  country?: string;
  taxId?: string;
  email?: string;
  phone?: string;
  website?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate?: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: Date | string;
  dueDate: Date | string;
  customer: InvoiceCustomer;
  company: InvoiceCompany;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  notes?: string;
  paymentTerms?: string;
  discount?: number;
  shipping?: number;
}

/**
 * Report-specific data models
 */

export interface ReportSubsection {
  title: string;
  content?: string;
  data?: any;
}

export interface ReportSection {
  title: string;
  content?: string;
  subsections?: ReportSubsection[];
  data?: any;
  chartData?: any;
  pageBreakAfter?: boolean;
}

export interface ReportCompany {
  name: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface ReportData {
  title: string;
  subtitle?: string;
  reportDate: Date | string;
  reportPeriod?: string;
  generatedBy?: string;
  company?: ReportCompany;
  sections: ReportSection[];
  summary?: {
    title?: string;
    items: Array<{
      label: string;
      value: string | number;
      highlight?: boolean;
    }>;
  };
  footer?: string;
}

/**
 * Table-specific data models
 */

export type TableAlign = 'left' | 'center' | 'right';

export interface TableColumn {
  /** Field name in the data object */
  field: string;
  
  /** Display header text */
  header: string;
  
  /** Column width (CSS value) */
  width?: string;
  
  /** Text alignment */
  align?: TableAlign;
  
  /** Custom format function */
  format?: (value: any, row: any) => string;
}

export interface TableFilter {
  label: string;
  value: string;
}

export interface TableCompany {
  name: string;
  logo?: string;
}

export interface TableData {
  /** Table title */
  title: string;
  
  /** Optional subtitle */
  subtitle?: string;
  
  /** Column definitions */
  columns: TableColumn[];
  
  /** Data rows */
  rows: any[];
  
  /** Optional summary/statistics */
  summary?: Array<{
    label: string;
    value: string | number;
  }>;
  
  /** Company information */
  company?: TableCompany;
  
  /** Applied filters */
  filters?: TableFilter[];
  
  /** Total number of records */
  totalRecords?: number;
  
  /** Show row numbers */
  showRowNumbers?: boolean;
  
  /** Generated date */
  generatedDate?: Date | string;
}

/**
 * Print preview component data passed via dialog
 */
export interface PrintPreviewData {
  /** The template component type to render */
  templateComponent: Type<any>;
  
  /** Data to pass to the template */
  data: any;
  
  /** Print options */
  options?: PrintOptions;
}

