import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ProductManager {
  constructor() {
    this.path = path.join(__dirname, '..', 'products.json');
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id == id);
  }

  async saveProducts(products) {
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
  }

  async addProduct(product) {
    const products = await this.getProducts();

    const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
    product.id = maxId + 1;

    products.push(product);
    await this.saveProducts(products);
    return product;
  }

  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id == id);
    if (index === -1) return null;

    const idOriginal = products[index].id;
    products[index] = { ...products[index], ...updatedFields, id: idOriginal };

    await this.saveProducts(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id != id);
    if (filtered.length === products.length) return false;
    await this.saveProducts(filtered);
    return true;
  }
}
