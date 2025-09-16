import mongoose from "mongoose";
import Product from "./src/dao/models/product.js";

const products = [
  { title: "Camiseta", description: "Camiseta deportiva", price: 20, stock: 50, category: "Ropa", code: "P001" },
  { title: "Pantalón", description: "Pantalón casual", price: 35, stock: 30, category: "Ropa", code: "P002" },
  { title: "Zapatos", description: "Zapatos deportivos", price: 50, stock: 20, category: "Calzado", code: "P003" }
];

const seedDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
    console.log("MongoDB conectado");

    await Product.deleteMany(); // limpia colección
    const inserted = await Product.insertMany(products);
    console.log("Productos insertados:", inserted);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.disconnect();
  }
};

seedDB();
