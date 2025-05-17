import express from "express";
import Product from "../models/product.model.js";

const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, category, sort } = req.query;
    const filter = category ? { category } : {};
    let sortOption = {};
    if (sort === 'asc') sortOption = { price: 1 };
    else if (sort === 'desc') sortOption = { price: -1 };

    const products = await Product.paginate(filter, { limit, page, sort: sortOption });
    res.status(200).json({ status: "success", payload: products });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

productsRouter.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if(!product) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

    res.status(200).json({ status: "success", payload: product });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    const product = new Product(newProduct);
    await product.save();
    res.status(201).json({ status: "success", payload: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

productsRouter.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedData = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      pid,
      updatedData,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    res.status(200).json({ status: "success", payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(pid);
    if (!deletedProduct) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    res.status(200).json({ status: "success", message: `Producto con id: ${pid} eliminado` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//endpoint para practicar aggregations
productsRouter.get("/aggregations/example", async(req, res)=> {
  try {
    const response = await Product.aggregate([
      { $match: { $text: { $search: "moderno" } } },
      { $match: { price: { $gt: 60000 } } },
      { 
        $project: {
          title: 1,
          description: 1,
          category: 1,
          price: 1
        } 
      }
    ]);

    res.status(200).json({ status: "succes", payload: response });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default productsRouter;