import Cart from "../models/cart.js";

class CartsMongoManager {
  async createCart() {
    return await Cart.create({ products: [] });
  }

  async getCartById(cid) {
    return await Cart.findById(cid).populate("products.product");
  }

  async addProduct(cid, pid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    const idx = cart.products.findIndex(p => p.product.toString() === pid);
    if (idx !== -1) cart.products[idx].quantity++;
    else cart.products.push({ product: pid, quantity: 1 });

    await cart.save();
    return cart;
  }

  async updateProductQuantity(cid, pid, quantity) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    const idx = cart.products.findIndex(p => p.product.toString() === pid);
    if (idx !== -1) cart.products[idx].quantity = quantity;

    await cart.save();
    return cart;
  }

  async replaceProducts(cid, products) {
    return await Cart.findByIdAndUpdate(cid, { products }, { new: true });
  }

  async deleteProduct(cid, pid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    return cart;
  }

  async clearCart(cid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    cart.products = [];
    await cart.save();
    return cart;
  }
}

export default CartsMongoManager;
