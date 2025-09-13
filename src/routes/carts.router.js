import mongoose from "mongoose";
import { Router } from "express";
import Cart from "../models/cart.js";

const router = Router();

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Crear carrito
router.post("/", async (req, res) => {
  try {
    const cart = await Cart.create({ products: [] });
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener carrito por ID con populate
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  if (!isValidObjectId(cid))
    return res.status(400).json({ error: "ID de carrito inválido" });

  const cart = await Cart.findById(cid).populate("products.product");
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart);
});

// Agregar producto
router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
if (!isValidObjectId(cid) || !isValidObjectId(pid))
    return res.status(400).json({ error: "ID de carrito o producto inválido" });

  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

  const prodIndex = cart.products.findIndex(p => p.product.toString() === pid);
  if (prodIndex !== -1) cart.products[prodIndex].quantity++;
  else cart.products.push({ product: pid, quantity: 1 });

  await cart.save();
  res.json(cart);
});

// Actualizar cantidad de producto
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
 if (!isValidObjectId(cid) || !isValidObjectId(pid))
    return res.status(400).json({ error: "ID de carrito o producto inválido" });

  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

  const prodIndex = cart.products.findIndex(p => p.product.toString() === pid);
  if (prodIndex !== -1) cart.products[prodIndex].quantity = quantity;

  await cart.save();
  res.json(cart);
});

// Actualizar todos los productos
router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body; // [{product, quantity}, ...]
  if (!isValidObjectId(cid))
    return res.status(400).json({ error: "ID de carrito inválido" });

  const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });
  res.json(cart);
});

// Eliminar un producto
router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  if (!isValidObjectId(cid) || !isValidObjectId(pid))
    return res.status(400).json({ error: "ID de carrito o producto inválido" });

  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

  cart.products = cart.products.filter(p => p.product.toString() !== pid);
  await cart.save();
  res.json(cart);
});

// Eliminar todos los productos
router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  if (!isValidObjectId(cid))
    return res.status(400).json({ error: "ID de carrito inválido" });

  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

  cart.products = [];
  await cart.save();
  res.json(cart);
});

export default router;

