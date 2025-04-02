import express from "express";
import redis from "redis";
import { nanoid } from "nanoid";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const client = redis.createClient(); // Conecta ao Redis

client.on("error", (err) => console.error("Erro no Redis", err));

// Conectar ao Redis
await client.connect();
console.log("Conectado ao Redis");

const BASE_URL = "http://localhost:3000"; // Troque pelo seu domínio depois

// Rota para encurtar URL
app.post("/encurtar", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL é obrigatória" });

  const shortId = nanoid(6);
  await client.set(shortId, url);

  res.json({ encurtado: `${BASE_URL}/${shortId}` });
});

// Rota para redirecionar
app.get("/:id", async (req, res) => {
  const { id } = req.params;
  const url = await client.get(id);

  if (!url) return res.status(404).json({ error: "URL não encontrada" });

  res.redirect(url);
});

// Rota para estatísticas
app.get("/stats/:id", async (req, res) => {
  const { id } = req.params;
  const url = await client.get(id);
  if (!url) return res.status(404).json({ error: "URL não encontrada" });

  res.json({ url });
});

// Inicia o servidor
app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
