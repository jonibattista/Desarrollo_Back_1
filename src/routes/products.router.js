import { Router } from "express";
import Product from "../models/product.js";

const router = Router();

export default (io) => {
  router.get("/", async (req, res) => {
    try {
      let { limit = 10, page = 1, sort, query } = req.query;
      limit = parseInt(limit);
      page = parseInt(page);

      const filter = query ? { category: query } : {};
      const options = { page, limit, lean: true };
      if (sort === "asc") options.sort = { price: 1 };
      else if (sort === "desc") options.sort = { price: -1 };

      const result = await Product.paginate(filter, options);

      // Si es request desde navegador, renderizamos la vista
      if (!req.xhr && !req.headers.accept.includes("application/json")) {
        return res.render("home", {
          products: result.docs,
          page: result.page,
          totalPages: result.totalPages,
          hasPrevPage: result.hasPrevPage,
          hasNextPage: result.hasNextPage,
          prevPage: result.prevPage,
          nextPage: result.nextPage,
          limit,
          title: "Lista de Productos"
        });
      }

      // Si es request AJAX / API, devolvemos JSON
      res.json({
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}` : null,
        nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}` : null
      });

    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

  // Resto de rutas POST, PUT, DELETE igual
  router.post("/", async (req, res) => {
    try {
      const product = await Product.create(req.body);
      const products = await Product.find();
      io.emit("productList", products);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

  return router;
};

