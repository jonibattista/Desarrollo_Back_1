import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class CartManager {
  constructor() {
    this.path = path.join(__dirname, '..', 'carts.json');
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(c => c.id == id);
  }

  async saveCarts(carts) {
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
  }

  async createCart() {
    const carts = await this.getCarts();
    const maxId = carts.reduce((max, c) => (c.id > max ? c.id : max), 0);
    const newCart = { id: maxId + 1, products: [] };
    carts.push(newCart);
    await this.saveCarts(carts);
    return newCart;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex(c => c.id == cartId);
    if (cartIndex === -1) return null;

    let productInCart = carts[cartIndex].products.find(p => p.product == productId);
    if (productInCart) {
      productInCart.quantity++;
    } else {
      carts[cartIndex].products.push({ product: productId, quantity: 1 });
    }

    await this.saveCarts(carts);
    return carts[cartIndex];
  }
}
