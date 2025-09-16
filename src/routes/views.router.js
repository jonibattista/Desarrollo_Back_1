import { Router } from "express";
import ProductsMongoManager from "../dao/managers/ProductsMongoManager.js";
import CartsMongoManager from "../dao/managers/CartsMongoManager.js";

const router = Router();
const productManager = new ProductsMongoManager();
const cartManager = new CartsMongoManager();

let cartId; // carrito de prueba

router.get("/", async (req, res) => {
  try {
    // Crear carrito si no existe
    if (!cartId) {
      const cart = await cartManager.createCart();
      cartId = cart._id.toString();
      console.log("Carrito creado:", cartId);
    }

    const result = await productManager.getAll({ limit: 10, page: 1 });

    res.render("home", {
      title: "Catálogo de Productos",
      products: result.docs,
      cartId
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cargar productos");
  }
});

export default router;


