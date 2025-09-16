import Product from "../models/product.js";

class ProductsMongoManager {
  async getAll({ limit = 10, page = 1, sort, query } = {}) {
    const filter = query ? { category: query } : {};
    const options = { page, limit, lean: true };
    if (sort === "asc") options.sort = { price: 1 };
    if (sort === "desc") options.sort = { price: -1 };

    return await Product.paginate(filter, options);
  }

  async getById(id) {
    return await Product.findById(id);
  }

  async create(data) {
    return await Product.create(data);
  }

  async update(id, data) {
    return await Product.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }
}

export default ProductsMongoManager; 
