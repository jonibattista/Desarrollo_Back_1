import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const pid = req.params.pid;
  const product = await productManager.getProductById(pid);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

router.post('/', async (req, res) => {
  const newProductData = req.body;

  if (
    !newProductData.title ||
    !newProductData.description ||
    !newProductData.code ||
    typeof newProductData.price !== 'number' ||
    typeof newProductData.stock !== 'number' ||
    !newProductData.category
  ) {
    return res.status(400).json({ error: 'Faltan o son incorrectos los campos obligatorios' });
  }

  newProductData.status = newProductData.status ?? true;
  newProductData.thumbnails = newProductData.thumbnails ?? [];

  const newProduct = await productManager.addProduct(newProductData);
  res.status(201).json(newProduct);
});


router.put('/:pid', async (req, res) => {
  const pid = req.params.pid;
  const updatedFields = req.body;
  if (updatedFields.id) delete updatedFields.id;

  const updatedProduct = await productManager.updateProduct(pid, updatedFields);
  if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });

  res.json(updatedProduct);
});

router.delete('/:pid', async (req, res) => {
  const pid = req.params.pid;
  const success = await productManager.deleteProduct(pid);
  if (!success) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json({ message: 'Producto eliminado' });
});

export default router;
