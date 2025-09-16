import { Router } from "express";
import ProductsMongoManager from "../dao/managers/ProductsMongoManager.js";

const router = Router();

export default (io) => {
  const productManager = new ProductsMongoManager();

  router.get("/", async (req, res) => {
    try {
      const result = await productManager.getAll(req.query);
      res.json({
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
        nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const product = await productManager.create(req.body);
      const products = await productManager.getAll({});
      io.emit("productList", products.docs);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

  return router;
};


