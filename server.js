import express from "express";
import redis from "redis";
import { nanoid } from "nanoid";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const client = redis.createClient();

client.on("error", (err) => console.error("Erro no Redis:", err));

await client.connect();
console.log("✅ Conectado ao Redis");

const BASE_URL = "http://localhost:3000";

// POST /encurtar → gera código e salva URL
app.post("/encurtar", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL é obrigatória" });

  const shortId = nanoid(6);
  await client.set(shortId, url);
  await client.set(`acessos:${shortId}`, 0); // inicializa contador

  res.json({ encurtado: `${BASE_URL}/${shortId}` });
});

// GET /:id → redireciona para a URL original
app.get("/:id", async (req, res) => {
  const { id } = req.params;
  const url = await client.get(id);

  if (!url) return res.status(404).json({ error: "URL não encontrada" });

  await client.incr(`acessos:${id}`); // incrementa contador
  res.redirect(url);
});

// GET /stats/:id → mostra estatísticas de acesso
app.get("/stats/:id", async (req, res) => {
  const { id } = req.params;
  const url = await client.get(id);
  const acessos = await client.get(`acessos:${id}`);

  if (!url) return res.status(404).json({ error: "URL não encontrada" });

  res.json({
    url,
    acessos: Number(acessos) || 0,
  });
});

// Inicia o servidor
app.listen(3000, () => console.log("🚀 Servidor rodando em http://localhost:3000"));
