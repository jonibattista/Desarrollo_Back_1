import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  code: { type: String, unique: true, required: true },
  stock: { type: Number, default: 0 },
  category: String,
  status: { type: Boolean, default: true }
});

productSchema.plugin(mongoosePaginate);

export default mongoose.model("Product", productSchema);
