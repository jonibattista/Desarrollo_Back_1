import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import createProductsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

// Configuración de __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicialización de Express y Socket.io
const app = express();
const server = createServer(app);
const io = new Server(server);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Configuración de Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Routers
app.use("/api/products", createProductsRouter(io));
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Socket.io
io.on("connection", socket => {
  console.log("Cliente conectado");
  // Aquí puedes agregar eventos personalizados
});

// Conexión a MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Error MongoDB:", err));

// Inicio del servidor
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
