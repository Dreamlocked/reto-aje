# RETO AJE — Gestión de Clientes

Aplicación full stack para administrar clientes: API REST en Node.js/Express (TypeScript) y frontend en React + Vite. La base de datos es PostgreSQL y existe integración con Retool mediante un patrón outbox.

## Requisitos

- **Docker Compose:** Docker y Docker Compose
- **Local:** Node.js 20+, npm y PostgreSQL 15+

## Ejecución con Docker Compose

La forma más sencilla de levantar todo el stack (base de datos, backend y frontend):

```bash
docker compose up --build
```

Para detener los servicios:

```bash
docker compose down
```

Para eliminar también los datos persistidos de PostgreSQL:

```bash
docker compose down -v
```

| Servicio   | URL |
|------------|-----|
| Frontend   | http://localhost:4000 |
| Backend API| http://localhost:3000/api/v1/clients |
| Swagger    | http://localhost:3000/api-docs |
| PostgreSQL | `localhost:5432` (usuario: `postgres`, contraseña: `postgres`, BD: `reto_db`) |

Al iniciar, el contenedor de PostgreSQL ejecuta automáticamente el script `db.sql` para crear las tablas.

## Ejecución en local

### 1. Base de datos

Crea la base de datos y las tablas. Puedes usar el script incluido:

```bash
psql -U postgres -c "CREATE DATABASE reto_db;"
psql -U postgres -d reto_db -f db.sql
```

O levantar solo PostgreSQL con Docker:

```bash
docker compose up db
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

El servidor arranca en **http://localhost:3000**. La documentación Swagger está en **http://localhost:3000/api-docs**.

Variables de entorno relevantes (ver `backend/.env.example`):

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del API | `3000` |
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_NAME` | Nombre de la BD | `reto_db` |
| `DB_USER` / `DB_PASSWORD` | Credenciales | `postgres` / `postgres` |
| `RETOOL_API_URL` | URL de Retool | Ver `.env.example` |
| `OUTBOX_INTERVAL_MS` | Intervalo del worker outbox | `30000` |

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev -- --port 4000
```

El frontend se sirve en **http://localhost:4000**. Usa el puerto 4000 porque el backend solo acepta peticiones CORS desde ese origen.

La variable `VITE_API_URL` en `frontend/.env` debe apuntar al backend:

```
VITE_API_URL=http://localhost:3000/api/v1
```

Si el backend no está disponible, el frontend puede operar con datos mock en memoria.

## Tests del backend

```bash
cd backend
npm run test:cov
```

## Estructura del proyecto

```
├── backend/          # API REST (Express, Sequelize, routing-controllers)
├── frontend/         # UI React + Vite + Tailwind
├── db.sql            # Esquema inicial de PostgreSQL
└── docker-compose.yml
```
