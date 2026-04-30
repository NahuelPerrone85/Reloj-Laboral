# Reloj Laboral

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E?style=flat-square&logo=nestjs)](https://nestjs.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=flat-square)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Sistema de control de horas laborales para empresas. Permite registrar entradas y salidas de empleados, gestionar horarios, proyectos y generar reportes.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Primeros Pasos](#primeros-pasos)
- [API Endpoints](#api-endpoints)
- [Modelo de Datos](#modelo-de-datos)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## Características

- Registro de fichaje (entrada/salida)
- Geolocalización de empleados (captura GPS al registrar)
- Dashboard con estadísticas en tiempo real (horas hoy/semana/mes)
- Validación de horarios (EARLY, ON_TIME, LATE, OUTSIDE)
- Gestión de empleados y empresas (CRUD admin)
- Tipos de horario (flexible, semiflexible, estricto)
- Gestión de proyectos con colores
- Solicitud y aprobación de vacaciones/ausencias
- Reportes en Excel y PDF
- API RESTful documentación con Swagger
- Autenticación JWT
- Interfaz visual consistente (recuadros blancos con sombra)
- Multi-dispositivo (Web, Responsive)

## Tecnologías

### Backend

| Tecnología | Versión | Descripción |
|-------------|---------|-------------|
| Node.js | 18.x | Runtime de JavaScript |
| NestJS | 10.x | Framework Node.js |
| Prisma | 5.x | ORM para PostgreSQL |
| PostgreSQL | 15.x | Base de datos relacional |
| Docker | Latest | Contenedores |

### Frontend

| Tecnología | Versión | Descripción |
|-------------|---------|-------------|
| React | 18.x | Biblioteca de UI |
| TypeScript | 5.x | Tipado estático |
| Vite | 5.x | Build tool |
| Tailwind CSS | 3.x | Framework CSS |
| Axios | Latest | Cliente HTTP |

### Scripts

| Tecnología | Descripción |
|-------------|-------------|
| Python 3.x | Generación de reportes |
| Pandas | Manipulación de datos |
| OpenPyXL | Exportación Excel |
| ReportLab | Generación PDF |

## Estructura del Proyecto

```
reloj-laboral/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── auth/          # Módulo autenticación
│   │   ├── users/         # Módulo usuarios
│   │   ├── companies/     # Módulo empresas
│   │   ├── clocking/      # Módulo fichajes
│   │   ├── schedules:     # Módulo horarios
│   │   ├── projects/      # Módulo proyectos
│   │   ├── reports/      # Módulo reportes
│   │   └── common/        # Utilidades comunes
│   │       ├── decorators/
│   │       ├── filters/
│   │       ├── interceptors/
│   │       ├── guards/
│   │       └── pipes/
│   ├── prisma/
│   │   └── schema.prisma  # Esquema de base de datos
│   └── package.json
├── frontend/                # React app
│   ├── src/
│   │   ├── components/   # Componentes compartidos
│   │   │   ├── Sidebar.tsx       # Navigation sidebar
│   │   │   ├── Layout.tsx        # Main layout
│   │   │   └── ui/                # UI components
│   │   │       ├── Button.tsx     # Reusable button
│   │   │       ├── Input.tsx      # Form input
│   │   │       ├── Card.tsx        # Card component
│   │   │       ├── Skeleton.tsx    # Loading skeletons
│   │   │       └── Toast.tsx       # Notifications
│   │   ├── pages/       # Páginas
│   │   ├── hooks/      # Custom hooks
│   │   ├── services/    # API calls
│   │   └── types/      # Tipos TypeScript
│   └── package.json
├── python/                 # Scripts reportes
│   ├── requirements.txt
│   └── reports/
│       ├── excel_report.py
│       └── pdf_report.py
├── docker-compose.yml      # Orquestación
├── .eslintrc.json
├── prettierrc.json
├── .editorconfig
└── README.md
```

## UI/UX

El proyecto cuenta con un sistema de diseño moderno y profesional:

### Componentes UI
- **Button**: Variantes (primary, secondary, danger, ghost, success), tamaños (sm, md, lg)
- **Input**: Labels, errores, hints, iconos
- **Card**: Header con acciones, padding variable
- **Skeleton**: Estados de carga
- **Toast**: Notificaciones automáticas

### Estilos Globales
- Paleta de colores extendida (primary, success, warning, danger, info)
- Border radius: xl (12px), 2xl (16px), 3xl (24px)
- Sombras: soft, card, card-hover
- Animaciones: fade-in, slide-up, scale-in, pulse-subtle

### Layout
- Sidebar fijo a la izquierda (240px)
- Navegación responsive (hamburger en móvil)
- Contenido con transición suave

### Landing Page
- Homepage profesional con pricing, features y testimonios
- Diseño moderno y responsivo
reloj-laboral/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── auth/          # Módulo autenticación
│   │   ├── users/         # Módulo usuarios
│   │   ├── companies/     # Módulo empresas
│   │   ├── clocking/      # Módulo fichajes
│   │   ├── schedules:     # Módulo horarios
│   │   ├── projects/      # Módulo proyectos
│   │   ├── reports/      # Módulo reportes
│   │   └── common/        # Utilidades comunes
│   │       ├── decorators/
│   │       ├── filters/
│   │       ├── interceptors/
│   │       ├── guards/
│   │       └── pipes/
│   ├── prisma/
│   │   └── schema.prisma  # Esquema de base de datos
│   └── package.json
├── frontend/                # React app
│   ├── src/
│   │   ├── components/   # Componentes compartidos
│   │   ├── pages/       # Páginas
│   │   ├── hooks/      # Custom hooks
│   │   ├── services/    # API calls
│   │   ���── types/      # Tipos TypeScript
│   │   └── utils/      # Utilidades
│   └── package.json
├── python/                 # Scripts reportes
│   ├── requirements.txt
│   └── reports/
│       ├── excel_report.py
│       └── pdf_report.py
├── docker-compose.yml      # Orquestación
├── .eslintrc.json
├── prettierrc.json
├── .editorconfig
└── README.md
```

## Primeros Pasos

### Requisitos Previos

- Node.js 18.x
- Docker y Docker Compose (opcional)
- PostgreSQL 15.x (o usar Docker)
- Python 3.x (para reportes)
- npm o yarn

### Comandos de Desarrollo

```bash
# Instalar dependencias backend
cd backend
npm install
npm run start:dev

# Ejecutar tests (27 tests passing)
npm test

# Linting
npm run lint

# Instalar dependencias frontend
cd ../frontend
npm install
npm run dev

# Build producción
npm run build
```

### Instalación

1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/reloj-laboral.git
cd reloj-laboral
```

2. Backend - Instalar dependencias

```bash
cd backend
npm install
```

3. Backend - Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. Backend - Ejecutar migraciones de base de datos

```bash
npx prisma migrate dev
```

5. Backend - Iniciar servidor

```bash
npm run start:dev
```

6. Frontend - Instalar dependencias

```bash
cd ../frontend
npm install
```

7. Frontend - Iniciar aplicación

```bash
npm run dev
```

### Usando Docker

```bash
# Desarrollo completo con Docker
docker-compose up -d

# Backend
docker-compose up -d backend

# Base de datos
docker-compose up -d postgres
```

## API Endpoints

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/register` | Registrar nuevo usuario |
| POST | `/auth/login` | Iniciar sesión |
| POST | `/auth/refresh` | Refresh token |
| GET | `/auth/profile` | Obtener perfil |

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/users` | Listar usuarios |
| GET | `/users/:id` | Obtener usuario |
| PATCH | `/users/:id` | Actualizar usuario |
| DELETE | `/users/:id` | Eliminar usuario |

### Empresas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/companies` | Listar empresas |
| POST | `/companies` | Crear empresa |
| GET | `/companies/:id` | Obtener empresa |
| PATCH | `/companies/:id` | Actualizar empresa |
| DELETE | `/companies/:id` | Eliminar empresa |

### Fichajes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/clocking` | Listar fichajes |
| POST | `/clocking/entry` | Registrar entrada |
| POST | `/clocking/exit` | Registrar salida |
| GET | `/clocking/user/:userId` | Fichajes por usuario |

### Horarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/schedules` | Listar horarios |
| POST | `/schedules` | Crear horario |
| GET | `/schedules/:id` | Obtener horario |
| PATCH | `/schedules/:id` | Actualizar horario |

### Proyectos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/projects` | Listar proyectos |
| POST | `/projects` | Crear proyecto |
| GET | `/projects/:id` | Obtener proyecto |
| PATCH | `/projects/:id` | Actualizar proyecto |

### Reportes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/reports/daily` | Reporte diario |
| GET | `/reports/weekly` | Reporte semanal |
| GET | `/reports/monthly` | Reporte mensual |

## Modelo de Datos

### Company (Empresa)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| name | String | Nombre de la empresa |
| createdAt | DateTime | Fecha creación |
| updatedAt | DateTime | Fecha actualización |

### User (Usuario)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| email | String | Email único |
| password | String | Password hasheado |
| name | String | Nombre completo |
| role | Enum | ADMIN, EMPLOYEE |
| companyId | UUID | FK a Company |

### Clocking (Fichaje)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| userId | UUID | FK a User |
| type | Enum | ENTRY, EXIT |
| timestamp | DateTime | Fecha/hora |
| latitude | Float? | Latitud GPS |
| longitude | Float? | Longitud GPS |
| deviceInfo | String? | Info dispositivo |
| projectId | UUID? | FK a Project |

### Schedule (Horario)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| companyId | UUID | FK a Company |
| name | String | Nombre del horario |
| type | Enum | FLEXIBLE, SEMIFLEXIBLE, STRICT |
| startTime | String | Hora inicio |
| endTime | String | Hora fin |

### Project (Proyecto)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| companyId | UUID | FK a Company |
| name | String | Nombre |
| description | String? | Descripción |
| color | String | Color hex |

## Contribuir

1. Fork el repositorio
2. Crear branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Credenciales de Demo

```
Admin:     admin@demo.com / password123
Empleado:  empleado@demo.com / password123
```

## Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

---

Si te gusta este proyecto, no olvides darle una estrella en GitHub!