import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

const VALID_GENDERS = ["MALE", "FEMALE", "OTHER"];

// GET /users - listar todos los usuarios con sus posts
router.get("/", async (_req, res) => {
  const users = await prisma.user.findMany({ include: { posts: true } });
  res.json(users);
});

// GET /users/:id - obtener un usuario por id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    include: { posts: true },
  });

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  res.json(user);
});

// POST /users - crear un usuario
router.post("/", async (req, res) => {
  const { name, email, birthDate, gender, favouriteFood, phone } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "name y email son requeridos" });
  }

  if (gender && !VALID_GENDERS.includes(gender)) {
    return res
      .status(400)
      .json({ error: `gender debe ser uno de: ${VALID_GENDERS.join(", ")}` });
  }

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        gender,
        favouriteFood,
        phone,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res
      .status(400)
      .json({ error: "No se pudo crear el usuario (email duplicado?)" });
  }
});

// PUT /users/:id - actualizar un usuario
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, email, birthDate, gender, favouriteFood, phone } = req.body;

  if (gender && !VALID_GENDERS.includes(gender)) {
    return res
      .status(400)
      .json({ error: `gender debe ser uno de: ${VALID_GENDERS.join(", ")}` });
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        gender,
        favouriteFood,
        phone,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: "Usuario no encontrado" });
  }
});

// DELETE /users/:id - eliminar un usuario
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: "Usuario no encontrado" });
  }
});

export default router;
