# Print System Architecture

## Overview

This document provides an in-depth look at the architecture, design patterns, and technical decisions behind the print system.

## 🏛️ Architectural Pattern

### Template Registry Pattern

The system uses a **Registry Pattern** combined with **Strategy Pattern** for managing multiple print templates:

```
┌─────────────────────────────────────────────────────────────┐
│                       Application Layer                       │
│  (Components that need to print documents)                    │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Print Service                           │
│  ┌──────────────────────────────────────────────────────┐    │
│  │         Template Registry (Map<string, Type>)         │    │
│  │  - Stores template component references              │    │
│  │  - Provides registration and retrieval                │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                                │
│  Methods:                                                      │
│  - registerTemplate()                                          │
│  - getTemplate()                                              │
│  - preview()                                                  │
│  - print()                                                    │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Print Preview Component                      │
│  - Opens as CDK Dialog                                        │
│  - Dynamically loads template component                       │
│  - Manages print lifecycle                                    │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Template Component (via CDK Portal)              │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │     Base Print Template Component (Abstract)            │  │
│  │  - Common functionality                                 │  │
│  │  - Helper methods                                       │  │
│  │  - Computed properties                                  │  │
│  └────────────────────┬───────────────────────────────────┘  │
│                       │                                        │
│          ┌────────────┴────────────┐                          │
│          ▼            ▼            ▼                          │
│    ┌─────────┐  ┌─────────┐  ┌─────────┐                    │
│    │ Invoice │  │ Report  │  │  Table  │                    │
│    └─────────┘  └─────────┘  └─────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Core Components

### 1. PrintService

**Responsibility**: Central orchestrator for all print operations

**Key Features**:
- Template registration and management
- Template retrieval and validation
- Dialog lifecycle management
- Print operation coordination

**Design Decisions**:
- Uses `Map` for O(1) template lookup
- Injectable at root level for singleton instance
- Async/await for better error handling
- Dynamic import for print preview (code splitting)

**Code Structure**:
```typescript
@Injectable({ providedIn: 'root' })
export class PrintService {
  private readonly templateRegistry = new Map<string, PrintTemplate>();
  
  // Registration
  registerTemplate(key, component, description?) { }
  
  // Retrieval
  getTemplate(key) { }
  hasTemplate(key) { }
  
  // Operations
  preview(config) { }
  printDirect(config) { }
  print() { }
}
```

### 2. PrintPreviewComponent

**Responsibility**: Modal dialog for preview and print trigger

**Key Features**:
- CDK Dialog integration
- Dynamic component loading via Portal
- Loading and error states
- Keyboard shortcuts (Ctrl+P, Esc)

**Design Decisions**:
- Uses `@angular/cdk/dialog` instead of Material (lighter weight)
- Dynamic component instantiation for flexibility
- Portal API for proper Angular component lifecycle
- Signal-based reactive state

**Lifecycle**:
```
Open Dialog → Create Portal → Load Component → Render → Print → Close
```

### 3. BasePrintTemplateComponent

**Responsibility**: Abstract base class for all print templates

**Key Features**:
- Common data and options inputs
- Helper methods (formatting, date, currency)
- Computed properties with signals
- Lifecycle hooks

**Design Decisions**:
- Abstract class (not interface) for implementation inheritance
- Signals for reactive computed properties
- Pure functions for formatting (testability)
- No external dependencies

**Inheritance Chain**:
```
BasePrintTemplateComponent (Abstract)
    ↓
InvoicePrintComponent
ReportPrintComponent
TablePrintComponent
CustomPrintComponent (User-defined)
```

### 4. Template Components

**Responsibility**: Render specific document types

**Key Features**:
- Extend BasePrintTemplateComponent
- Type-safe data interfaces
- Custom rendering logic
- Print-optimized styles

## 🔄 Data Flow

### Print Operation Flow

```
1. User Action
   ↓
2. Component calls printService.preview(config)
   ↓
3. PrintService validates template exists
   ↓
4. PrintService opens PrintPreviewComponent as dialog
   ↓
5. PrintPreviewComponent creates component portal
   ↓
6. Portal instantiates template component
   ↓
7. Template receives data and options via @Input
   ↓
8. Template renders content
   ↓
9. User clicks "Print" button
   ↓
10. window.print() is called
   ↓
11. Browser shows print dialog
   ↓
12. User confirms/cancels
   ↓
13. Dialog closes
```

### Registration Flow

```
1. App Initialization (APP_INITIALIZER)
   ↓
2. registerPrintTemplates() function runs
   ↓
3. PrintService.registerTemplate() called for each template
   ↓
4. Template stored in Map<key, metadata>
   ↓
5. Templates available for use
```

## 💾 State Management

### Service State

```typescript
class PrintService {
  // Registry state (persistent)
  private templateRegistry: Map<string, PrintTemplate>
  
  // Dialog state (transient)
  private activeDialogRef: DialogRef | null
}
```

### Component State

```typescript
class PrintPreviewComponent {
  // Reactive signals
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly isReady = computed(() => !this.isLoading() && !this.error());
}
```

### Template State

```typescript
class BasePrintTemplateComponent {
  // Inputs
  @Input() data: any;
  @Input() options?: PrintOptions;
  
  // Computed
  readonly showHeader = computed(() => this.options?.showHeader ?? true);
  readonly pageSize = computed(() => this.options?.pageSize ?? 'A4');
}
```

## 🎨 Styling Strategy

### Three-Layer Approach

1. **Global Print Styles** (`print-global.scss`)
   - Applied to entire app
   - Print media queries
   - Hide non-print elements
   - Page setup

2. **Base Template Styles** (`base-print-template.component.scss`)
   - Shared across all templates
   - Page sizes and orientations
   - Common utilities
   - Base typography

3. **Template-Specific Styles**
   - Unique to each template
   - Custom layouts
   - Branding elements
   - Print optimizations

### CSS Architecture

```scss
// Specificity Hierarchy
.print-container                    // Base (lowest)
  .page-a4                          // Size modifier
    .orientation-portrait           // Orientation modifier
      .invoice-header               // Component-specific
        .company-logo               // Element (highest)
```

## 🔌 Dependency Injection

### Service Injection

```typescript
// Root level - singleton
@Injectable({ providedIn: 'root' })
export class PrintService { }

// Component level
export class MyComponent {
  private printService = inject(PrintService);
}
```

### Dialog Data Injection

```typescript
constructor(
  @Inject(DIALOG_DATA) public data: PrintPreviewData
) { }
```

## 🧩 Design Patterns Used

### 1. Registry Pattern
**Purpose**: Manage collection of templates
```typescript
private templateRegistry = new Map<string, PrintTemplate>();
```

### 2. Strategy Pattern
**Purpose**: Interchangeable template algorithms
```typescript
interface BasePrintTemplate {
  data: any;
  options?: PrintOptions;
}
```

### 3. Factory Pattern
**Purpose**: Dynamic component creation
```typescript
const componentRef = viewContainerRef.createComponent(templateComponent);
```

### 4. Template Method Pattern
**Purpose**: Define algorithm skeleton in base class
```typescript
abstract class BasePrintTemplateComponent {
  // Template method
  getContainerClasses() {
    return ['print-container', this.pageSize(), this.orientation()];
  }
}
```

### 5. Observer Pattern
**Purpose**: Signal-based reactivity
```typescript
readonly isLoading = signal(true);
readonly isReady = computed(() => !this.isLoading());
```

## 🚀 Performance Optimizations

### 1. Lazy Loading

```typescript
// Dynamic import
const { PrintPreviewComponent } = await import(
  '../../shared/components/print-preview/print-preview.component'
);
```

### 2. Change Detection

```typescript
// OnPush strategy (could be added)
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### 3. Template Caching

Templates are registered once and reused:
```typescript
private templateRegistry = new Map<string, PrintTemplate>();
```

### 4. Computed Values

Using signals for efficient reactivity:
```typescript
readonly showHeader = computed(() => this.options?.showHeader ?? true);
```

## 🔒 Type Safety

### Strong Typing Throughout

```typescript
// Interfaces
interface PrintConfig { }
interface PrintOptions { }
interface InvoiceData { }

// Generic types
Type<any>  // Component references

// Type guards
if (this.isArray(data)) { }
```

### Type-Safe Template Data

```typescript
export class InvoicePrintComponent extends BasePrintTemplateComponent {
  @Input({ required: true }) override data!: InvoiceData;
}
```

## 🧪 Testing Strategy

### Unit Tests

```typescript
describe('PrintService', () => {
  it('should register template', () => {
    service.registerTemplate('test', TestComponent);
    expect(service.hasTemplate('test')).toBe(true);
  });
});
```

### Integration Tests

```typescript
describe('Print Flow', () => {
  it('should open preview and print', async () => {
    await service.preview({ templateKey: 'invoice', data });
    // Assert dialog opened
    // Assert template rendered
  });
});
```

### E2E Tests

```typescript
it('should print invoice', () => {
  cy.get('[data-test="print-invoice"]').click();
  cy.get('[data-test="print-preview"]').should('be.visible');
  cy.get('[data-test="print-button"]').click();
});
```

## 📐 SOLID Principles

### Single Responsibility
Each class has one reason to change:
- `PrintService`: Template management
- `PrintPreviewComponent`: Dialog management
- `InvoicePrintComponent`: Invoice rendering

### Open/Closed
System is open for extension (new templates) but closed for modification:
```typescript
// Adding new template doesn't require changing service
printService.registerTemplate('custom', CustomComponent);
```

### Liskov Substitution
Any template can be used where BasePrintTemplate is expected:
```typescript
const template: BasePrintTemplate = new InvoicePrintComponent();
```

### Interface Segregation
Small, focused interfaces:
```typescript
interface PrintTemplate { key, component, description }
interface PrintConfig { templateKey, data, options }
```

### Dependency Inversion
Depend on abstractions:
```typescript
abstract class BasePrintTemplateComponent { }
class InvoicePrintComponent extends BasePrintTemplateComponent { }
```

## 🌐 Browser Compatibility

### Print API
Uses standard `window.print()` - supported by all modern browsers

### CSS Grid
Used in layouts - IE11 not supported (acceptable for modern apps)

### Angular Signals
Angular 17+ feature - requires modern framework version

### CDK Dialog
Angular CDK component - well-supported

## 📊 Scalability Considerations

### Adding Templates
Simply create component and register - no service changes needed

### Template Variants
Can register multiple variants of same template:
```typescript
registerTemplate('invoice-simple', InvoiceSimpleComponent);
registerTemplate('invoice-detailed', InvoiceDetailedComponent);
```

### Internationalization
Supports RTL, custom date/number formats:
```typescript
options: { rtl: true, locale: 'ar-SA' }
```

### Large Documents
Handles pagination via CSS page breaks

## 🔐 Security Considerations

### XSS Prevention
- No `innerHTML` usage without sanitization
- Template binding for all dynamic content
- Validation of user inputs

### Data Privacy
- No data stored in service
- Templates receive data via inputs only
- No external API calls from templates

## 📈 Future Enhancements

Potential improvements:

1. **PDF Generation**: Add option to generate PDF directly
2. **Email Integration**: Send printed documents via email
3. **Save Templates**: Allow users to save custom templates
4. **Batch Printing**: Print multiple documents at once
5. **Print Queue**: Queue documents for sequential printing
6. **Analytics**: Track which templates are most used
7. **Audit Trail**: Log print operations
8. **Watermark Templates**: Pre-defined watermark styles

## 📚 References

- [Angular Architecture Guide](https://angular.io/guide/architecture)
- [Angular CDK Documentation](https://material.angular.io/cdk)
- [CSS Print Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/@media)
- [Window.print() API](https://developer.mozilla.org/en-US/docs/Web/API/Window/print)

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Maintainer**: Print System Team

