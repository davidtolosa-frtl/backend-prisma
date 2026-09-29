import express from "express";
import swaggerUi from "swagger-ui-express";
import usersRouter from "./routes/users";
import postsRouter from "./routes/posts";
import { swaggerDocument } from "./swagger";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/docs.json", (_req, res) => {
  res.json(swaggerDocument);
});

app.use("/users", usersRouter);
app.use("/posts", postsRouter);

app.get("/", (_req, res) => {
  res.json({ message: "API funcionando 🚀" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación Swagger en http://localhost:${PORT}/docs`);
});
