import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager();

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error('Error al crear carrito:', error);
    res.status(500).json({ error: 'Error interno al crear carrito' });
  }
});

// Obtener un carrito por ID
router.get('/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartManager.getCartById(cid);

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(cart.products);
  } catch (error) {
    console.error(`Error al obtener carrito ${req.params.cid}:`, error);
    res.status(500).json({ error: 'Error interno al obtener carrito' });
  }
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.addProductToCart(cid, pid);

    if (!updatedCart) {
      return res.status(404).json({ error: 'Carrito no encontrado o producto inválido' });
    }

    res.json(updatedCart);
  } catch (error) {
    console.error(`Error al agregar producto ${req.params.pid} al carrito ${req.params.cid}:`, error);
    res.status(500).json({ error: 'Error interno al actualizar carrito' });
  }
});

export default router;

