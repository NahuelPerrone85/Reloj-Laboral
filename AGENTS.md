# Reloj Laboral - AGENTS.md

## Project Structure

```
reloj-laboral/
├── backend/              # NestJS API (port 3000)
│   ├── src/
│   │   ├── auth/        # Authentication (JWT)
│   │   ├── users/       # User CRUD
│   │   ├── companies/   # Company CRUD
│   │   ├── clocking/    # Fichaje (entry/exit)
│   │   ├── schedules/  # Work schedules + validation
│   │   ├── projects/   # Project management
│   │   ├── reports/    # Daily/weekly/monthly reports
│   │   ├── vacations/  # Vacation & leave requests
│   │   └── prisma/     # Prisma service
│   ├── src/auth/__tests__/     # Auth tests
│   ├── src/clocking/__tests__/  # Clocking tests
│   ├── src/vacations/__tests__/   # Vacations tests
│   ├── src/schedules/__tests__/   # Schedules tests
│   └── prisma/
│       └── schema.prisma
├── frontend/            # React + Vite + Tailwind (port 5173)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.tsx       # Navigation sidebar
│   │   │   ├── Layout.tsx        # Main layout
│   │   │   └── ui/               # UI components
│   │   │       ├── Button.tsx    # Reusable button
│   │   │       ├── Input.tsx     # Form input
│   │   │       ├── Card.tsx      # Card component
│   │   │       ├── Skeleton.tsx  # Loading skeletons
│   │   │       └── Toast.tsx     # Notifications
│   │   ├── pages/       # Login, Register, Dashboard, Clocking, Users, Companies, Projects, Vacations
│   │   ├── hooks/       # useAuth, useGeolocation
│   │   ├── services/    # API client
│   │   └── types/       # TypeScript interfaces
├── python/            # Report scripts (Excel/PDF)
└── docker-compose.yml
```

## Developer Commands

```bash
# Prerequisites
# - Node.js 18.x
# - PostgreSQL 15.x (or Docker)

# Backend setup
cd backend
npm install
cp .env.example .env               # Configure DATABASE_URL
npx prisma migrate dev --name init
npx prisma generate
npm run start:dev                  # http://localhost:3000

# Run tests
npm test                         # 27 tests passing

# Run seed (creates demo data)
npx ts-node prisma/seed.ts

# Frontend setup
cd frontend
npm install
npm run dev                       # http://localhost:5173

# Docker full stack
docker-compose up -d
```

## Frontend Pages

| Route | Page | Access |
|-------|------|-------|
| `/login` | LoginPage | Public |
| `/register` | RegisterPage | Public |
| `/dashboard` | DashboardPage | Auth |
| `/clocking` | ClockingPage | Auth |
| `/vacations` | VacationsPage | Auth |
| `/users` | UsersPage | Admin |
| `/companies` | CompaniesPage | Admin |
| `/projects` | ProjectsPage | Admin |

## API Endpoints

| Module | Endpoint | Methods |
|--------|----------|---------|
| Auth | `/api/auth/login` | POST |
| Auth | `/api/auth/register` | POST |
| Auth | `/api/auth/profile` | GET |
| Users | `/api/users` | GET |
| Users | `/api/users/:id` | GET, PATCH, DELETE |
| Companies | `/api/companies` | GET, POST |
| Companies | `/api/companies/:id` | GET, PATCH, DELETE |
| Clocking | `/api/clocking` | GET |
| Clocking | `/api/clocking/entry` | POST |
| Clocking | `/api/clocking/exit` | POST |
| Clocking | `/api/clocking/user/:userId` | GET |
| Clocking | `/api/clocking/today/:userId` | GET |
| Schedules | `/api/schedules` | GET, POST |
| Schedules | `/api/schedules/:id` | GET, PATCH, DELETE |
| Projects | `/api/projects` | GET, POST |
| Projects | `/api/projects/:id` | GET, PATCH, DELETE |
| Reports | `/api/reports/daily` | GET |
| Reports | `/api/reports/weekly` | GET |
| Reports | `/api/reports/monthly` | GET |
| Vacations | `/api/vacations` | GET, POST |
| Vacations | `/api/vacations/my` | GET |
| Vacations | `/api/vacations/pending` | GET |
| Vacations | `/api/vacations/:id` | GET, PATCH, DELETE |

## Features

- **Dashboard**: Estadísticas en tiempo real (horas hoy/semana/mes), gráfico de barras, tiempo actual trabajado
- **Geolocalización**: Captura GPS al registrar entrada/salida (HTML5 Geolocation API)
- **Validación de Horarios**: Compara fichajes vs horarios de la empresa (EARLY, ON_TIME, LATE, OUTSIDE)
- **Vacaciones**: Solicitudes de permiso (vacaciones, baja médica, asunto personal), aprobación por administrador
- **Landing Page**: Página principal profesional con pricing, features y testimonios
- **UI/UX Moderno**: Diseño moderno con sidebar, cards mejoradas, animaciones suaves

## API Access

- Base: `http://localhost:3000/api`
- Swagger docs: `http://localhost:3000/api/docs`
- Frontend proxies `/api` → `reloj-laboral-api:3000` (Docker)

## Database

- Prisma schema: `backend/prisma/schema.prisma`
- Migration: `backend/prisma/migrations/`
- Seed: `backend/prisma/seed.ts`
- Run `npx prisma studio` to explore DB locally

## Demo Credentials

```
Admin:     admin@demo.com / password123
Employee: empleado@demo.com / password123
```

## Key Conventions

- TypeScript strict mode enabled
- DTOs use `class-validator` + `@nestjs/swagger` decorators (ApiProperty)
- JWT auth with `passport-jwt` (secretOrKey)
- All DTOs in singular `.dto.ts` files per module
- PrismaModule is global (imported in AppModule)
- Prisma imports: `import { PrismaService } from '../prisma/prisma.service'`
- Validador imports: `import { IsString } from 'class-validator'`
- Tests in `__tests__/` directories

## Key Files

### Backend Services
- `backend/src/schedules/schedules.service.ts` - Schedule validation (validateClockingTime)
- `backend/src/clocking/clocking.service.ts` - Clocking with validation integration
- `backend/src/auth/strategies/jwt.strategy.ts` - JWT authentication

### Frontend Hooks
- `frontend/src/hooks/useGeolocation.ts` - GPS location capture
- `frontend/src/hooks/useAuth.ts` - Authentication state

## Current Status

- Backend API: ✅ Running on port 3000
- PostgreSQL: ✅ Running on port 5432 (Docker)
- Frontend: ✅ Running on port 5173
- Dashboard: ✅ Con estadísticas (horas hoy/semana/mes), cards con iconos
- Geolocalización: ✅ Captura GPS al fichar
- Validación horarios: ✅ Entrada/salida validada contra schedule
- Vacaciones: ✅ Módulo completo implementado
- Companies: ✅ CRUD de empresas (admin)
- Projects: ✅ CRUD de proyectos (admin)
- UI/UX: ✅ Diseño consistente y profesional
- Landing Page: ✅ Profesional con pricing y testimonios
- Database seeded with demo data
- Tests: ✅ 27 tests passing (auth, clocking, vacations, schedules)

## UI/UX Improvements

### Components Created
- `Button.tsx` - Botón reutilizable (variants: primary, secondary, danger, ghost, success)
- `Input.tsx` - Input con label, error, hints
- `Card.tsx` - Card con header y content
- `Skeleton.tsx` - Estados de carga
- `Toast.tsx` - Notificaciones

### Design System
- Tailwind config: Custom colors (success, warning, danger, info)
- Border radius: xl (12px), 2xl (16px), 3xl (24px)
- Shadows: soft, card, card-hover
- Animations: fade-in, slide-up, scale-in, pulse-subtle
- Components use `.card` class for consistent styling

### Layout
- Sidebar: Fixed, responsive, with user info and logout
- Navigation: Active states with primary-50 background
- Responsive: Collapses to hamburger menu on mobile

## Tech Stack

- **Backend**: NestJS 10.x, Prisma 5.x, PostgreSQL 15.x
- **Frontend**: React 18.x, TypeScript 5.x, Vite 5.x, Tailwind CSS 3.x
- **Testing**: Jest (backend), 27 tests passing

## ESLint Configuration

- Backend: `backend/.eslintrc.json`
- Frontend: `frontend/.eslintrc.json`
- Run `npm run lint` in each directory

## Key Commands

```bash
# Backend
cd backend
npm run lint      # Run ESLint
npm test         # Run tests
npm run start:dev

# Frontend
cd frontend
npx eslint src --ext ts,tsx  # Run ESLint
npm run build                # Production build
npm run dev                  # Dev server
```