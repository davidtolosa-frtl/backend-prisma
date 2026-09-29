# Prisma Express API

API REST de ejemplo construida con **Express**, **TypeScript** y **Prisma** sobre **SQLite**. Expone un CRUD de **usuarios** y **posts**, con documentación interactiva vía **Swagger UI**.

## Tecnologías

| Herramienta | Uso |
| --- | --- |
| [Express 4](https://expressjs.com/) | Servidor HTTP y enrutamiento |
| [TypeScript 5](https://www.typescriptlang.org/) | Tipado estático |
| [Prisma 5](https://www.prisma.io/) | ORM, migraciones y cliente de base de datos |
| SQLite | Base de datos local (`prisma/dev.db`) |
| [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express) | Documentación OpenAPI 3 |
| [tsx](https://github.com/privatenumber/tsx) | Ejecución en desarrollo con recarga automática |

## Estructura del proyecto

```text
.
├── prisma/
│   ├── schema.prisma        # Modelos User y Post
│   ├── migrations/          # Historial de migraciones
│   └── dev.db               # Base de datos SQLite (ignorada por git)
├── src/
│   ├── server.ts            # Punto de entrada de Express
│   ├── prisma.ts            # Instancia compartida de PrismaClient
│   ├── swagger.ts           # Especificación OpenAPI
│   └── routes/
│       ├── users.ts         # Rutas /users
│       └── posts.ts         # Rutas /posts
├── .env.example             # Plantilla de variables de entorno
├── .gitignore
├── package.json
└── tsconfig.json
```

> `.env` y `prisma/*.db` están en `.gitignore`: cada entorno crea su propio `.env` y genera la base de datos con `npm run prisma:migrate`.

## Requisitos

- Node.js 18 o superior
- npm

## Instalación

```bash
npm install
```

Crea el archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

```env
DATABASE_URL="file:./dev.db"
PORT=3000
```

> `DATABASE_URL` es relativa a `prisma/schema.prisma`. Si no se define `PORT`, el servidor usa el puerto `3000`.

Aplica las migraciones y genera el cliente de Prisma:

```bash
npm run prisma:migrate
npm run prisma:generate
```

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor en modo desarrollo con recarga automática |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Ejecuta la versión compilada (`dist/server.js`) |
| `npm run prisma:generate` | Genera el cliente de Prisma |
| `npm run prisma:migrate` | Crea y aplica migraciones en desarrollo |
| `npm run prisma:studio` | Abre Prisma Studio para explorar los datos |

## Uso

```bash
npm run dev
```

- API: <http://localhost:3000>
- Swagger UI: <http://localhost:3000/docs>
- Especificación OpenAPI (JSON): <http://localhost:3000/docs.json>

## Modelo de datos

### User (`users`)

| Campo | Tipo | Notas |
| --- | --- | --- |
| `id` | Int | Autoincremental |
| `name` | String | Requerido |
| `email` | String | Requerido, único |
| `birthDate` | DateTime? | Opcional |
| `gender` | String? | Opcional: `MALE`, `FEMALE` u `OTHER` |
| `phone` | String? | Opcional |
| `createdAt` | DateTime | Fecha de creación |
| `posts` | Post[] | Relación uno a muchos |

### Post (`posts`)

| Campo | Tipo | Notas |
| --- | --- | --- |
| `id` | Int | Autoincremental |
| `title` | String | Requerido |
| `content` | String? | Opcional |
| `published` | Boolean | Por defecto `false` |
| `authorId` | Int | FK a `users.id` |
| `createdAt` | DateTime | Fecha de creación |

## Endpoints

### Usuarios

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/users` | Lista todos los usuarios con sus posts |
| GET | `/users/:id` | Obtiene un usuario por id |
| POST | `/users` | Crea un usuario |
| PUT | `/users/:id` | Actualiza un usuario |
| DELETE | `/users/:id` | Elimina un usuario |

### Posts

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/posts` | Lista todos los posts con su autor |
| GET | `/posts/:id` | Obtiene un post por id |
| POST | `/posts` | Crea un post |
| PUT | `/posts/:id` | Actualiza un post |
| DELETE | `/posts/:id` | Elimina un post |

### Ejemplos

Crear un usuario:

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Ana", "email": "ana@example.com", "birthDate": "1990-05-20", "gender": "FEMALE", "phone": "+54 11 1234-5678"}'
```

Crear un post:

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Mi primer post", "content": "Contenido del post", "authorId": 1}'
```

Publicar un post:

```bash
curl -X PUT http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"published": true}'
```

### Errores

Los errores se devuelven como JSON con la forma:

```json
{ "error": "Usuario no encontrado" }
```

- `400`: faltan campos requeridos, `gender` inválido, email duplicado o `authorId` inexistente.
- `404`: el recurso no existe.

> **Nota:** la relación `Post → User` usa `ON DELETE RESTRICT`, así que un usuario que tiene posts no se puede eliminar hasta borrar sus posts. En ese caso la API responde actualmente con `404`.
