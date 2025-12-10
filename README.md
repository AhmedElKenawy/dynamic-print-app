# Print App – Angular Print System

Production-ready print system for Angular 18+ using standalone components, Angular CDK Dialog/Portal, and native `window.print()`. Includes reusable templates (invoice, report, table), a print preview modal, and global print styles.

## Features
- Standalone Angular 18+ architecture
- Template registry with type-safe models
- Print preview modal (CDK Dialog + Portal)
- Built-in templates: Invoice, Report, Data Table
- Page sizes: A4, Letter, Legal; portrait/landscape
- RTL support, watermark option, page numbers
- Global print styles & media-ready CSS

## Project Structure (key parts)
```
src/app/
├── core/services/print.service.ts         # Template registry + print orchestration
├── shared/models/print.models.ts          # Interfaces and types
├── shared/components/print-preview/       # Preview dialog (CDK)
├── shared/print-templates/                # Templates (invoice, report, table)
│   ├── base/                              # Base abstract component + shared SCSS
│   ├── invoice/                           # Invoice template
│   ├── report/                            # Report template
│   └── table/                             # Data table template
├── styles/print-global.scss               # Global print CSS utilities
├── app.component.*                        # Demo UI with sample data/actions
└── app.config.ts                          # APP_INITIALIZER template registration
```

## Prerequisites
- Node.js 18+
- npm 9+ (or pnpm/yarn)

## Install
```bash
npm install
```

> Note: We pin `@angular/cdk@^18` to match Angular 18.x.

## Run Dev Server
```bash
# default port 4200
npm start
# or specify port
ng serve --port 4201
```

Then open http://localhost:4200 (or chosen port).

## Build
```bash
ng build --configuration production
```

## How Printing Works
1. Templates are registered in `app.config.ts` via `APP_INITIALIZER`.
2. Components call `printService.preview({ templateKey, data, options })`.
3. CDK Dialog opens `PrintPreviewComponent`, which dynamically instantiates the template.
4. Users click **Print** (or press `Ctrl+P`) to invoke `window.print()`.

## Template Registration
Registered in `app.config.ts`:
```ts
printService.registerTemplate('invoice', InvoicePrintComponent);
printService.registerTemplate('report', ReportPrintComponent);
printService.registerTemplate('table', TablePrintComponent);
```

## Using the Service (examples)
```ts
await printService.preview({
  templateKey: 'invoice',
  data: invoiceData,
  options: { pageSize: 'A4', orientation: 'portrait', title: 'Invoice' }
});

// Direct print without preview
await printService.printDirect({ templateKey: 'report', data: reportData });
```

## Options
`PrintOptions` include:
- `orientation`: 'portrait' | 'landscape'
- `pageSize`: 'A4' | 'Letter' | 'Legal'
- `showHeader`, `showFooter`, `showPageNumbers`
- `title`, `headerData`, `footerData`
- `rtl`, `watermark`, `copies`

## Styling
- Global print CSS: `src/app/styles/print-global.scss` (added to `angular.json` styles)
- Base template SCSS: common layout, page sizes, utilities
- Template-specific SCSS per template folder
- CDK overlay styles included: `@angular/cdk/overlay-prebuilt.css`

## Adding a New Template
1. Create a standalone component extending `BasePrintTemplateComponent`.
2. Add your HTML/SCSS and typed `data` input.
3. Export it in `shared/print-templates/index.ts`.
4. Register via `printService.registerTemplate('key', YourComponent)` (e.g., in `APP_INITIALIZER`).

## Files of Interest
- `src/app/core/services/print.service.ts` – registry, preview/print, defaults
- `src/app/shared/components/print-preview/*` – dialog UI & dynamic loading
- `src/app/shared/print-templates/*` – invoice/report/table implementations
- `src/app/styles/print-global.scss` – global print rules and utilities

## Troubleshooting
- **Template not found**: Ensure registration in `app.config.ts` and correct `templateKey`.
- **Dialog not styled / overlay missing**: Confirm `@angular/cdk/overlay-prebuilt.css` is in `angular.json` styles and restart `ng serve`.
- **Images not showing**: Use accessible URLs or place assets under `src/assets`; avoid relative `../../` paths.
- **Colors not printing**: `print-global.scss` enforces `-webkit-print-color-adjust: exact`; ensure it’s included.

## Scripts
- `npm start` – `ng serve`
- `npm run build` – production build

## License
This project is provided as-is for your internal use. Customize as needed.
# PrintApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
