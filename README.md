# Tournament Match Number Tracker

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.7 and uses NX for monorepo management.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and configure it with your credentials:

```bash
cp .env.dev.example .env.dev
```

Edit [.env.dev](.env.dev) and replace `[YOUR_PASSWORD]` with your actual Supabase password.

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. Run Database Migrations (Optional)

If you need to create/update the database schema:

```bash
npm run prisma:migrate:dev
```

## Development server

### Frontend (Angular)

To start the Angular frontend development server, run:

```bash
npm start
# or
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Backend (NestJS)

To start the NestJS backend development server, run:

```bash
npm run serve:dev
# or for the specific dev target
npm run serve:dev:server
```

The backend API will be available at `http://localhost:3000/` (or the PORT specified in your .env.dev file).

### Running Both Servers

You can run both frontend and backend in separate terminal windows for full-stack development.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Database Management (Prisma)

### Generate Prisma Client

After modifying the Prisma schema, regenerate the client:

```bash
npm run prisma:generate
```

### Create/Apply Migrations

To create and apply database migrations:

```bash
npm run prisma:migrate:dev
```

### Prisma Studio (Database GUI)

To open Prisma Studio for visual database management:

```bash
npm run prisma:studio
```

This will open a web interface at `http://localhost:5555` where you can view and edit your database records.

## Project Structure

- `apps/app-frontend/` - Angular frontend application
- `apps/app-server/` - NestJS backend API
- `prisma/` - Database schema and migrations
- `libs/` - Shared libraries
- `.env.dev` - Development environment variables
- `prisma.config.ts` - Prisma configuration with environment support

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
