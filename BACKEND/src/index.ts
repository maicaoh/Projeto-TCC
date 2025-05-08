import express from "express";
import { AppDataSource } from "./data-source";
import routes from "./routes";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 6000;
let server: any; 
app.use(cors()); 

app.use(express.json({
  limit: "100mb",
  type: "application/json"
}));
app.use(express.urlencoded({
  limit: "100mb",
  extended: true,
  type: "application/x-www-form-urlencoded"
}));


app.use(routes);

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Banco de dados conectado!");

    server = app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Erro ao iniciar o banco de dados:", error);
    process.exit(1);
  });

// 🛑 Encerrar o servidor corretamente antes do restart
const shutdown = () => {
  if (server) {
    console.log("🛑 Encerrando servidor...");
    server.close(() => {
      console.log("✅ Servidor encerrado.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

// Capturar eventos de encerramento do Nodemon
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
process.on("beforeExit", shutdown);
