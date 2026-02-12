# ERP Ticketera - Frontend (React + Vite)

Mini modulo ERP/ticketera con autenticacion JWT mock, rutas protegidas, listado de tickets con filtros/paginacion, detalle y formulario de creacion/edicion.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- Zustand
- TanStack React Query
- React Hook Form + Zod
- Axios
- jose
- Framer Motion
- Lucide React
- class-variance-authority + clsx + tailwind-merge
- Radix UI (Dialog)
- React Aria Components (Select personalizado)
- Mock API con JSON Server + servidor custom (`server.mjs`)

## Setup

Requisitos:

- Node.js 20+
- npm 10+

Instalacion:

```bash
npm install
```

## Comandos

Iniciar frontend:

```bash
npm run dev
```

Iniciar mock API:

```bash
npm run server
```

Build de produccion:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Typecheck:

```bash
npm run typecheck
```

## Estructura de carpetas

- `src/layouts`: layout principal de app (sidebar + header)
- `src/routes`: proteccion de rutas y watcher de sesion
- `src/stores`: estado global con Zustand
- `src/querys`: hooks/mutaciones de React Query y query keys
- `src/services`: capa de llamadas HTTP
- `src/components`: UI reusable y modulo tickets
- `src/views`: pantallas (`/login`, `/app/tickets`)
- `src/request`: cliente Axios e interceptores
- `src/utils`: helpers (JWT)
- `server.mjs`: mock API y login JWT
- `db.json`: datos mock

## Decisiones tecnicas

- Se usa React Query para estado de servidor y cache.
- Se usa Zustand para estado global de auth.
- La sesion persiste en localStorage solo con `user` y `token` usando `partialize`.
- El listado de tickets usa paginacion server-like y filtros en backend mock.
- El cambio de estado de ticket usa optimistic update con rollback.

## Auth y expiracion

- Login: `POST /auth/login` retorna `{ accessToken, user }`.
- El token se guarda en `authStore`.
- Rutas protegidas en `ProtectedRoute`.
- `SessionWatcher` revisa expiracion periodicamente y ejecuta logout.
- Interceptor de Axios:
  - agrega `Authorization: Bearer <token>`
  - ante token expirado fuerza logout y rechaza la request
  - ante `401` ejecuta logout
- Logout limpia sesion y cache de React Query.

## Diseno de query keys

En `src/querys/index.ts`:

- `ticketKeys.all = ["tickets"]`
- `ticketKeys.list(params) = ["tickets", "list", params]`
- `ticketKeys.detail(id) = ["tickets", "detail", id]`

Esto garantiza cache separada por filtros, pagina, pageSize y sort.

## Endpoints mock

- `POST /auth/login`
- `GET /tickets?q=&status=&priority=&_sort=updatedAt&_order=desc&_page=1&_per_page=10`
- `GET /tickets/:id`
- `POST /tickets`
- `PUT /tickets/:id`
- `PATCH /tickets/:id/status`

## Notas

- El manejo de conflicto `409` y tests automatizados no estan incluidos en esta iteracion.
