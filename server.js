import express from "express";
import redis from "redis";
import { nanoid } from "nanoid";
import cors from "cors";

async function main() {
  const app = express();
  app.use(express.json());
  app.use(express.static("public"));
  app.use(cors());

  const client = redis.createClient({
  url: "redis://default:Jsrd3dIhlY417OjiRX5046uWcf8A6a1Y@redis-18631.c308.sa-east-1-1.ec2.redns.redis-cloud.com:18631"
});


  client.on("error", (err) => console.error("Erro no Redis:", err));

  await client.connect();
  console.log("Conectado ao Redis");

  const BASE_URL = "http://localhost:3000";

  app.post("/encurtar", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL é obrigatória" });

    const shortId = nanoid(6);
    await client.set(shortId, url);
    await client.set(`acessos:${shortId}`, 0);

    res.json({ encurtado: `${BASE_URL}/${shortId}` });
  });

  app.get("/:id", async (req, res) => {
    const { id } = req.params;
    const url = await client.get(id);

    if (!url) return res.status(404).json({ error: "URL não encontrada" });

    await client.incr(`acessos:${id}`);
    res.redirect(url);
  });

  app.get("/stats/:id", async (req, res) => {
    const { id } = req.params;
    const url = await client.get(id);
    const acessos = await client.get(`acessos:${id}`);

    if (!url) return res.status(404).json({ error: "URL não encontrada" });

    res.json({ url, acessos: Number(acessos) || 0 });
  });

  app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
}

main().catch((err) => {
  console.error("Erro ao iniciar o servidor:", err);
});
