import { Router } from "express";
import CartsMongoManager from "../dao/managers/CartsMongoManager.js";

const router = Router();

// Crear carrito
router.post("/", async (req, res) => {
  try {
    const cart = await CartsMongoManager.createCart();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener carrito por ID con populate
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartsMongoManager.getCartById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await CartsMongoManager.addProduct(cid, pid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await CartsMongoManager.updateProductQuantity(cid, pid, quantity);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reemplazar todos los productos del carrito
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body; // [{ product, quantity }]
    const cart = await CartsMongoManager.replaceProducts(cid, products);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await CartsMongoManager.deleteProduct(cid, pid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vaciar el carrito
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartsMongoManager.clearCart(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
