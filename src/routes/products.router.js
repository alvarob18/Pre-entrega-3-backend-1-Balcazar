import express from 'express';
import ProductManager from '../ProductManager.js';
import uploader from '../utils/uploader.js';

export default (io) => {
  const pm = new ProductManager();
  const router = express.Router();

  router.post('/', uploader.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "Falta imagen" });

    const { title, price } = req.body;
    const thumbnail = '/img/' + req.file.filename;
    const products = await pm.addProduct({ title, price: parseInt(price), thumbnail });

    io.emit('productsUpdated', products);

    res.redirect('/dashboard');
  });

  router.delete('/:id', async (req, res) => {
    const deleted = await pm.deleteProductById(parseInt(req.params.id));
    io.emit('productsUpdated', deleted);
    res.json({ status: 'ok', deletedId: req.params.id });
  });

  return router;
};