# ERP Ticketera - Frontend (React + Vite)

Mini modulo ERP/ticketera con autenticacion JWT mock, rutas protegidas, listado de tickets con filtros/paginacion, detalle y formulario de creacion/edicion.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- shadcn/ui (style `new-york`)
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

Tests (Vitest + React Testing Library):

```bash
npm run test
```

Tests una sola ejecucion:

```bash
npm run test:run
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
- `src/components/ui`: componentes generados con CLI de shadcn/ui
- `components.json`: configuracion de shadcn/ui (estilo `new-york`)
- `server.mjs`: mock API y login JWT
- `db.json`: datos mock

## Componentes shadcn/ui

Se utilizan componentes de shadcn/ui instalados con el CLI oficial (`npx shadcn@latest add ...`):

- **Input** (`src/components/ui/input.tsx`): usado en login y en el formulario de tickets (titulo, solicitante, email, etiquetas). El resto de la UI (Button, Card, Label, Select con React Aria, Dialog con Radix) se mantiene en `src/components/sui` con el mismo criterio visual.

## Decisiones tecnicas

- Se usa React Query para estado de servidor y cache.
- Se usa Zustand para estado global de auth.
- La sesion persiste en localStorage solo con `user` y `token` usando `partialize`.
- El listado de tickets usa paginacion server-like y filtros en backend mock.
- El cambio de estado de ticket usa optimistic update con rollback.
- Para concurrencia en edicion, se envia `If-Unmodified-Since` con el `updatedAt` conocido por el cliente.

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

## Manejo de concurrencia (409)

Para evitar que dos ediciones simultaneas del mismo ticket se pisen, se implemento control de concurrencia:

**Backend (`server.mjs`):**

- En `PUT /tickets/:id` se lee el `updatedAt` esperado por el cliente (header `If-Unmodified-Since` o body `expectedUpdatedAt`).
- Se compara con el `updatedAt` actual del ticket en la base.
- Si **no coinciden**: se responde **409 Conflict** con `code: "TICKET_CONFLICT"`, `message` y `currentTicket` (version actual en servidor).
- Si coinciden: se aplica el update y se responde 200.

**Frontend:**

- El servicio de tickets (`tickets.service.ts`) envia `expectedUpdatedAt` en cada edicion y exporta `isTicketConflictError()` para detectar el 409.
- En la vista de edicion, si la API devuelve 409 se muestra un toast de conflicto y se recarga el ticket (`refetch`) para que el usuario pueda editar sobre la ultima version.

## Tests

Tests con Vitest y React Testing Library:

- **`src/routes/ProtectedRoute.test.tsx`**: redireccion a `/login` cuando no hay sesion.
- **`src/views/LoginView.test.tsx`**: validacion del formulario (errores al enviar vacio).
- **`src/services/tickets.service.test.ts`**: propagacion y deteccion del error 409 (concurrencia).

Ejecutar tests:

```bash
npm run test
```

Una sola ejecucion:

```bash
npm run test:run
```

## Notas

- Se mantiene JWT mock con expiracion y limpieza de cache de React Query en logout.
