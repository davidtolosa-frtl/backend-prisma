import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

// GET /posts - listar todos los posts con su autor
router.get("/", async (_req, res) => {
  const posts = await prisma.post.findMany({ include: { author: true } });
  res.json(posts);
});

// GET /posts/:id - obtener un post por id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!post) {
    return res.status(404).json({ error: "Post no encontrado" });
  }

  res.json(post);
});

// POST /posts - crear un post
router.post("/", async (req, res) => {
  const { title, content, authorId, published } = req.body;

  if (!title || !authorId) {
    return res.status(400).json({ error: "title y authorId son requeridos" });
  }

  try {
    const post = await prisma.post.create({
      data: { title, content, authorId: Number(authorId), published: Boolean(published) },
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: "No se pudo crear el post (authorId inválido?)" });
  }
});

// PUT /posts/:id - actualizar un post
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, content, published } = req.body;

  try {
    const post = await prisma.post.update({
      where: { id },
      data: { title, content, published },
    });
    res.json(post);
  } catch (error) {
    res.status(404).json({ error: "Post no encontrado" });
  }
});

// DELETE /posts/:id - eliminar un post
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.post.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: "Post no encontrado" });
  }
});

export default router;
