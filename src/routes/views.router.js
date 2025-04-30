import { Router } from 'express';
import ProductManager from '../ProductManager.js';

export default (io) => {
  const router = Router();
  const pm = new ProductManager();

  router.get('/', async (req, res) => {
    const products = await pm.getProducts();
    res.render('home', { products });
  });
  
  router.get('/realtimeproducts', async (req, res) => {
    const products = await pm.getProducts();
    res.render('realTimeProducts', { products });
  });

  return router;
};