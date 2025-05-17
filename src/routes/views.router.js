import express from "express";
import Product from "../models/product.model.js";

const viewsRouter = express.Router();

viewsRouter.get("/", async(req, res)=> {
  try{
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const {
      docs,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      page: currentPage
    } = await Product.paginate({}, { limit, page, lean: true });

    const pages = Array.from({ length: totalPages }, (_, i) => ({
      number: i + 1,
      active: i + 1 === currentPage
    }));

    res.render("home", {
      products: docs,
      pagination: { hasPrevPage, prevPage, pages, hasNextPage, nextPage }
    });
  }catch(error){
    res.status(500).send({ message: error.message });
  }
});

// Detalle de producto
viewsRouter.get("/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await Product.findById(pid).lean();
    if (!product) {
      return res.status(404).render("404", { message: "Producto no encontrado" });
    }

    res.render("productDetail", { product });
  }catch (err){
    res.status(500).send({ message: error.message });
  }
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render("realTimeProducts", { products });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default viewsRouter;