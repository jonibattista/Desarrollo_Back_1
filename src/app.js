import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

const productManager = new ProductManager();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Handlebars setup
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Routers
app.use("/api/products", productsRouter);
app.use("/", viewsRouter);

// Socket.io
io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  // enviar lista inicial
  const products = await productManager.getProducts();
  socket.emit("productList", products);

  // escuchar creación desde websocket
  socket.on("newProduct", async (data) => {
    await productManager.addProduct(data);
    const products = await productManager.getProducts();
    io.emit("productList", products);
  });

  // escuchar eliminación desde websocket
  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);
    const products = await productManager.getProducts();
    io.emit("productList", products);
  });
});

// Compartir io en la app para usarlo en el router API
app.set("io", io);

server.listen(8080, () => {
  console.log("Servidor en http://localhost:8080");
});
