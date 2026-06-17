# RETO AJE — Gestión de Clientes

Aplicación full stack para administrar clientes: API REST en Node.js/Express (TypeScript) y frontend en React + Vite. La base de datos es PostgreSQL y existe integración con Retool mediante un patrón outbox.
Repositorio Público: https://github.com/Dreamlocked/reto-aje 

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

## Arquitectura y decisiones técnicas

### Patrón Outbox + Circuit Breaker y reintentos

La integración con Retool es asíncrona y tolerante a fallos. Cuando se crea, actualiza o elimina un cliente, el handler intenta sincronizar con Retool de forma inmediata. Si la llamada falla tras todos los reintentos, el evento se persiste en la tabla `Outboxes` dentro de la misma transacción que guarda el cliente local, garantizando consistencia.

Un worker (`OutboxWorker`) ejecuta periódicamente el caso de uso `ProcessOutboxHandler`, que lee los eventos pendientes y vuelve a intentar la sincronización. Si un intento falla, incrementa el contador `retries` y registra `lastError`; si tiene éxito, marca el evento como `processed`.

Esta combinación permite:

- **No bloquear al usuario** si Retool está lento o caído: la operación local se completa y la sincronización se reintenta en segundo plano.
- **Aprovechar el Circuit Breaker** implementado con `opossum` en `RetoolService`: evita saturar Retool cuando el servicio está degradado, abriendo el circuito tras un umbral de errores y cerrándolo automáticamente tras un tiempo de espera.
- **Reintentos en dos niveles**: dentro de cada llamada a Retool (hasta 3 intentos con backoff implícito) y a nivel outbox (reprocesamiento periódico de eventos fallidos).

Flujo resumido:

```
Usuario → API → Handler → RetoolService (retry + circuit breaker)
                ↓ (si falla)
            Outbox (BD) → OutboxWorker → ProcessOutboxHandler → RetoolService
```

### Validaciones en frontend y backend

Las validaciones se aplican en ambas capas para mejorar la experiencia de usuario y proteger la API:

- **Backend:** los comandos de entrada (`CreateClientCommand`, `UpdateClientCommand`, etc.) usan `class-validator` y se validan mediante el middleware `ValidateInput` antes de ejecutar cada handler. Los errores se devuelven en formato Problem Details (RFC 7807) con el detalle por campo.
- **Frontend:** los formularios de creación y edición muestran errores por campo. El servicio `clientService` traduce las respuestas 400 del backend (`mapBackendValidationErrors`) y los componentes los presentan en la UI sin que el usuario tenga que interpretar respuestas crudas de la API.

### Arquitectura limpia — Backend

El backend organiza el código en capas con dependencias hacia el dominio:

| Capa | Ubicación | Responsabilidad |
|------|-----------|-----------------|
| **Domain** | `src/domain/` | Entidades, excepciones de negocio (`ProblemDetailError`) |
| **Application** | `src/application/use-cases/` | Casos de uso: handlers, commands, queries y outputs |
| **Infrastructure** | `src/infrastructure/` | Sequelize (`DbContext`), `RetoolService`, worker outbox |
| **Presentation** | `src/presentation/` | Controladores REST, middlewares de validación y errores, Swagger |

Los controladores solo reciben peticiones y delegan a los handlers; la lógica de negocio y la orquestación con Retool/outbox residen en la capa de aplicación, sin acoplar el dominio a Express ni a Sequelize.

### Arquitectura limpia — Frontend

El frontend separa responsabilidades por tipo de módulo:

| Módulo | Ubicación | Responsabilidad |
|--------|-----------|-----------------|
| **Componentes** | `src/components/` | UI por feature (lista, crear, editar, eliminar) y componentes compartidos (`Modal`) |
| **Hooks** | `src/hooks/` | Estado y lógica de presentación (`useClients`) |
| **Servicios** | `src/services/` | Comunicación con la API y fallback a mocks |
| **Layout** | `src/layout/` | Estructura visual común (`Header`) |

Los componentes no llaman a la API directamente: consumen el hook o callbacks que a su vez usan `clientService`, manteniendo la UI desacoplada del transporte HTTP.
