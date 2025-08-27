import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

router.post("/", async (req, res) => {
  const product = await productManager.addProduct(req.body);

  const io = req.app.get("io");
  const products = await productManager.getProducts();
  io.emit("productList", products);

  res.json(product);
});

router.delete("/:id", async (req, res) => {
  const deleted = await productManager.deleteProduct(req.params.id);

  if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });

  const io = req.app.get("io");
  const products = await productManager.getProducts();
  io.emit("productList", products);

  res.json({ success: true });
});

export default router;
