const idParam = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "integer" },
};

const errorResponse = (description: string) => ({
  description,
  content: {
    "application/json": { schema: { $ref: "#/components/schemas/Error" } },
  },
});

export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "Prisma Express API",
    version: "1.0.0",
    description: "API de ejemplo con Express, TypeScript y Prisma (Usuarios y Posts)",
  },
  servers: [{ url: "/" }],
  tags: [{ name: "Users" }, { name: "Posts" }],
  paths: {
    "/users": {
      get: {
        tags: ["Users"],
        summary: "Listar todos los usuarios con sus posts",
        responses: {
          200: {
            description: "Lista de usuarios",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/UserWithPosts" } },
              },
            },
          },
        },
      },
      post: {
        tags: ["Users"],
        summary: "Crear un usuario",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/UserCreate" } },
          },
        },
        responses: {
          201: {
            description: "Usuario creado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } },
          },
          400: errorResponse("Datos inválidos o email duplicado"),
        },
      },
    },
    "/users/{id}": {
      parameters: [idParam],
      get: {
        tags: ["Users"],
        summary: "Obtener un usuario por id",
        responses: {
          200: {
            description: "Usuario encontrado",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/UserWithPosts" } },
            },
          },
          404: errorResponse("Usuario no encontrado"),
        },
      },
      put: {
        tags: ["Users"],
        summary: "Actualizar un usuario",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/UserUpdate" } },
          },
        },
        responses: {
          200: {
            description: "Usuario actualizado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } },
          },
          400: errorResponse("gender inválido"),
          404: errorResponse("Usuario no encontrado"),
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Eliminar un usuario",
        responses: {
          204: { description: "Usuario eliminado" },
          404: errorResponse("Usuario no encontrado"),
        },
      },
    },
    "/posts": {
      get: {
        tags: ["Posts"],
        summary: "Listar todos los posts con su autor",
        responses: {
          200: {
            description: "Lista de posts",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/PostWithAuthor" } },
              },
            },
          },
        },
      },
      post: {
        tags: ["Posts"],
        summary: "Crear un post",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/PostCreate" } },
          },
        },
        responses: {
          201: {
            description: "Post creado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Post" } } },
          },
          400: errorResponse("Datos inválidos o authorId inexistente"),
        },
      },
    },
    "/posts/{id}": {
      parameters: [idParam],
      get: {
        tags: ["Posts"],
        summary: "Obtener un post por id",
        responses: {
          200: {
            description: "Post encontrado",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/PostWithAuthor" } },
            },
          },
          404: errorResponse("Post no encontrado"),
        },
      },
      put: {
        tags: ["Posts"],
        summary: "Actualizar un post",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/PostUpdate" } },
          },
        },
        responses: {
          200: {
            description: "Post actualizado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Post" } } },
          },
          404: errorResponse("Post no encontrado"),
        },
      },
      delete: {
        tags: ["Posts"],
        summary: "Eliminar un post",
        responses: {
          204: { description: "Post eliminado" },
          404: errorResponse("Post no encontrado"),
        },
      },
    },
  },
  components: {
    schemas: {
      Error: {
        type: "object",
        properties: { error: { type: "string" } },
      },
      Gender: {
        type: "string",
        enum: ["MALE", "FEMALE", "OTHER"],
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Ana" },
          email: { type: "string", format: "email", example: "ana@example.com" },
          birthDate: { type: "string", format: "date-time", nullable: true },
          gender: { $ref: "#/components/schemas/Gender" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      UserWithPosts: {
        allOf: [
          { $ref: "#/components/schemas/User" },
          {
            type: "object",
            properties: {
              posts: { type: "array", items: { $ref: "#/components/schemas/Post" } },
            },
          },
        ],
      },
      UserCreate: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name: { type: "string", example: "Ana" },
          email: { type: "string", format: "email", example: "ana@example.com" },
          birthDate: { type: "string", format: "date", example: "1990-05-20" },
          gender: { $ref: "#/components/schemas/Gender" },
        },
      },
      UserUpdate: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          birthDate: { type: "string", format: "date" },
          gender: { $ref: "#/components/schemas/Gender" },
        },
      },
      Post: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Mi primer post" },
          content: { type: "string", nullable: true },
          published: { type: "boolean", example: false },
          authorId: { type: "integer", example: 1 },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      PostWithAuthor: {
        allOf: [
          { $ref: "#/components/schemas/Post" },
          {
            type: "object",
            properties: { author: { $ref: "#/components/schemas/User" } },
          },
        ],
      },
      PostCreate: {
        type: "object",
        required: ["title", "authorId"],
        properties: {
          title: { type: "string", example: "Mi primer post" },
          content: { type: "string", example: "Contenido del post" },
          authorId: { type: "integer", example: 1 },
          published: { type: "boolean", example: false },
        },
      },
      PostUpdate: {
        type: "object",
        properties: {
          title: { type: "string" },
          content: { type: "string" },
          published: { type: "boolean" },
        },
      },
    },
  },
};
