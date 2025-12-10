

# Print System Setup Guide

Complete step-by-step guide to integrating the print system into your Angular application.

## 📋 Prerequisites

- Angular 17 or higher
- Node.js 18 or higher
- npm or yarn package manager

## 🚀 Installation Steps

### Step 1: Install Dependencies

```bash
npm install @angular/cdk
```

Or with yarn:

```bash
yarn add @angular/cdk
```

### Step 2: Copy Files

Copy all files from the print system to your Angular project maintaining the directory structure:

```
src/app/
├── core/
│   └── services/
│       └── print.service.ts
├── shared/
│   ├── components/
│   │   └── print-preview/
│   ├── models/
│   │   └── print.models.ts
│   └── print-templates/
│       ├── base/
│       ├── invoice/
│       ├── report/
│       ├── table/
│       └── index.ts
└── styles/
    └── print-global.scss
```

### Step 3: Update angular.json

Add the global print styles to your `angular.json`:

```json
{
  "projects": {
    "your-app-name": {
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

### Step 4: Create App Configuration

If you don't have `app.config.ts`, create it:

```typescript
// src/app/app.config.ts
import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { PrintService } from './core/services/print.service';
import { 
  InvoicePrintComponent,
  ReportPrintComponent,
  TablePrintComponent
} from './shared/print-templates';

/**
 * Register print templates on app initialization
 */
export function registerPrintTemplates(printService: PrintService): () => void {
  return () => {
    printService.registerTemplate('invoice', InvoicePrintComponent, 'Invoice template');
    printService.registerTemplate('report', ReportPrintComponent, 'Report template');
    printService.registerTemplate('table', TablePrintComponent, 'Table template');
    console.log('✅ Print templates registered');
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    {
      provide: APP_INITIALIZER,
      useFactory: registerPrintTemplates,
      deps: [PrintService],
      multi: true
    }
  ]
};
```

### Step 5: Update main.ts

Ensure your `main.ts` uses the app configuration:

```typescript
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

### Step 6: Verify Installation

Run your application:

```bash
ng serve
```

Check the browser console for the success message:
```
✅ Print templates registered
```

## 📝 Basic Usage

### In Your Component

```typescript
import { Component, inject } from '@angular/core';
import { PrintService } from './core/services/print.service';
import { InvoiceData } from './shared/models/print.models';

@Component({
  selector: 'app-invoice',
  template: `
    <button (click)="printInvoice()">Print Invoice</button>
  `
})
export class InvoiceComponent {
  private printService = inject(PrintService);

  async printInvoice(): Promise<void> {
    const invoiceData: InvoiceData = {
      invoiceNumber: 'INV-001',
      invoiceDate: new Date(),
      dueDate: new Date(),
      customer: {
        name: 'Customer Name',
        address: '123 Street',
        city: 'City',
        country: 'Country'
      },
      company: {
        name: 'Your Company',
        address: '456 Avenue'
      },
      items: [
        {
          description: 'Service',
          quantity: 1,
          unitPrice: 100,
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
        orientation: 'portrait'
      }
    });
  }
}
```

## 🧪 Testing the Installation

### Create a Test Component

```bash
ng generate component test-print
```

```typescript
// test-print.component.ts
import { Component, inject } from '@angular/core';
import { PrintService } from '../core/services/print.service';

@Component({
  selector: 'app-test-print',
  standalone: true,
  template: `
    <div style="padding: 20px;">
      <h1>Print System Test</h1>
      <button (click)="testPrint()">Test Print</button>
      <p *ngIf="message">{{ message }}</p>
    </div>
  `
})
export class TestPrintComponent {
  private printService = inject(PrintService);
  message = '';

  async testPrint(): Promise<void> {
    try {
      // Check if templates are registered
      const templates = this.printService.getRegisteredTemplates();
      this.message = `Found ${templates.length} templates: ${templates.join(', ')}`;

      // Test print
      await this.printService.preview({
        templateKey: 'invoice',
        data: {
          invoiceNumber: 'TEST-001',
          invoiceDate: new Date(),
          dueDate: new Date(),
          customer: {
            name: 'Test Customer',
            address: 'Test Address',
            city: 'Test City',
            country: 'Test Country'
          },
          company: {
            name: 'Test Company',
            address: 'Test Address'
          },
          items: [
            { description: 'Test Item', quantity: 1, unitPrice: 100, total: 100 }
          ],
          subtotal: 100,
          tax: 10,
          total: 110,
          currency: 'USD'
        }
      });
    } catch (error: any) {
      this.message = `Error: ${error.message}`;
    }
  }
}
```

Add to your routes and test!

## 🔧 Configuration Options

### Angular.json Additional Options

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
            ],
            "stylePreprocessorOptions": {
              "includePaths": [
                "src/app/styles"
              ]
            }
          }
        }
      }
    }
  }
}
```

### TypeScript Configuration

Ensure your `tsconfig.json` has proper settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "esModuleInterop": true
  }
}
```

## 🎨 Customization

### Adding Custom Fonts

1. Add fonts to your `styles.scss`:

```scss
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
}
```

2. Update print templates to use your font:

```scss
// In template SCSS
.print-container {
  font-family: 'Roboto', sans-serif;
}
```

### Custom Colors

Create a variables file:

```scss
// src/app/styles/_variables.scss
$primary-color: #your-color;
$accent-color: #your-accent;
```

Import in templates:

```scss
@import '../../styles/variables';

.invoice-header {
  background: $primary-color;
}
```

### Adding Your Logo

1. Place logo in `src/assets/images/logo.png`
2. Reference in data:

```typescript
company: {
  name: 'Your Company',
  logo: 'assets/images/logo.png', // ← Use assets path
  address: '...'
}
```

## 📱 Production Build

### Before Building

1. Optimize images in assets folder
2. Remove console.log statements from service (if any)
3. Test all templates in production mode

### Build Command

```bash
ng build --configuration production
```

### Verify Build

```bash
ng serve --configuration production
```

## 🐛 Common Issues and Solutions

### Issue 1: Templates Not Found

**Symptom**: Error "Print template 'invoice' not found"

**Solution**:
- Check that `APP_INITIALIZER` is in `app.config.ts`
- Verify imports are correct
- Check browser console for registration message

### Issue 2: Styles Not Applied

**Symptom**: Print preview looks unstyled

**Solution**:
- Ensure `print-global.scss` is in `angular.json`
- Check that component `styleUrls` includes base styles
- Clear browser cache and rebuild

### Issue 3: Images Not Loading

**Symptom**: Logos/images don't appear

**Solution**:
- Use `assets/` path, not relative paths
- Verify image files exist
- Check browser network tab for 404 errors

### Issue 4: CDK Dialog Not Working

**Symptom**: Preview doesn't open

**Solution**:
```bash
# Reinstall @angular/cdk
npm install @angular/cdk --save

# Or
yarn add @angular/cdk
```

### Issue 5: Print Shows Dialog Chrome

**Symptom**: Buttons/headers visible when printing

**Solution**:
- Verify `no-print` class is applied
- Check that `print-global.scss` is loaded
- Test in different browsers

## 📊 Performance Optimization

### Lazy Loading Print Preview

Already implemented! The print preview component is dynamically imported.

### Optimize Images

```bash
# Using imagemin-cli
npm install -g imagemin-cli
imagemin assets/images/*.png --out-dir=assets/images-optimized
```

### Reduce Bundle Size

Add this to `angular.json`:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "optimization": true,
              "sourceMap": false,
              "namedChunks": false
            }
          }
        }
      }
    }
  }
}
```

## 🔒 Security Considerations

### Sanitize User Input

When displaying user-provided content:

```typescript
import { DomSanitizer } from '@angular/platform-browser';

constructor(private sanitizer: DomSanitizer) {}

getSafeHtml(html: string) {
  return this.sanitizer.sanitize(SecurityContext.HTML, html);
}
```

### Validate Data

Always validate data before printing:

```typescript
async printInvoice(data: any): Promise<void> {
  // Validate
  if (!data.invoiceNumber || !data.customer) {
    throw new Error('Invalid invoice data');
  }

  // Type-cast safely
  const invoiceData = data as InvoiceData;
  
  await this.printService.preview({
    templateKey: 'invoice',
    data: invoiceData
  });
}
```

## 🚢 Deployment

### Nginx Configuration

If serving from Nginx, ensure proper MIME types:

```nginx
http {
  include       mime.types;
  default_type  application/octet-stream;

  types {
    text/css css;
    application/javascript js;
    image/svg+xml svg;
  }
}
```

### Apache Configuration

For Apache servers:

```apache
<FilesMatch "\.css$">
  Header set Content-Type "text/css"
</FilesMatch>
```

## 📚 Next Steps

1. Review the [PRINT_SYSTEM_README.md](./PRINT_SYSTEM_README.md) for detailed API documentation
2. Check [usage-examples.component.ts](./examples/usage-examples.component.ts) for code examples
3. See [custom-template-example.ts](./examples/custom-template-example.ts) to create your own templates
4. Customize colors and fonts to match your brand
5. Add your company logo to the assets folder

## 💡 Tips

- **Test Early**: Test printing in different browsers (Chrome, Firefox, Safari, Edge)
- **Mobile Testing**: Test on mobile devices - they may have different print dialogs
- **PDF Testing**: Test saving as PDF from the print dialog
- **Landscape Mode**: Use landscape for wide tables
- **Page Breaks**: Use `.avoid-break` class to keep content together
- **Colors**: Test that colors print correctly (not just grayscale)

## 🆘 Getting Help

If you encounter issues:

1. Check browser console for errors
2. Verify all files are in correct locations
3. Ensure Angular CDK is installed
4. Check that templates are registered
5. Test with the simple test component above

## ✅ Checklist

Before going to production:

- [ ] All templates registered in APP_INITIALIZER
- [ ] Global styles added to angular.json
- [ ] Tested in multiple browsers
- [ ] Images loading correctly
- [ ] Colors printing correctly
- [ ] Page breaks working as expected
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Production build tested
- [ ] Logo added to assets
- [ ] Custom colors applied (if needed)

---

**🎉 Congratulations!** You've successfully integrated the print system. Happy printing!

