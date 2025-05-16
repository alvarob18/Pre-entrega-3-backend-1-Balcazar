import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from "socket.io";
import http from "http";
import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import ProductManager from "./ProductManager.js";
import CartManager from "./cart_manager.js";
import path from 'path';
import connectMongoDB from "./config/db.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve('./src/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use("/api/carts", cartRouter);

const productManager = new ProductManager();
const cartManager = new CartManager();

connectMongoDB();

//endpoints
app.get('/home', (req, res)=> {
  res.send("Hola mundo desde express!");
});

//products
app.get('/api/products', async(req, res)=> {
  const products = await productManager.getAllProducts();
  res.status(200).json({ products: products, message: "lista de productos" });
});

app.get('/api/products/:id', async(req, res)=> {
  const productId = req.params.id;
  const products = await productManager.getProductById(productId);
  res.status(200).json({ products: products, message: "producto por id" });
});

app.delete('/api/products/:id', async(req, res)=>{
  const productId = req.params.id;
  const products = await productManager.deleteProductById(productId);
  res.status(200).json({ products: products, message: "producto eliminado" })
});

app.post('/api/products', async(req, res)=> {
  const newProduct = req.body;
  const products = await productManager.createProduct(newProduct);
  res.status(201).json({ products: products, message: "nuevo producto creado" });
});

app.put('/api/products/:id', async(req, res)=> {
  const productId = req.params.id;
  const updatedData = req.body;
  const products = await productManager.updateProductById(productId, updatedData);
  res.status(200).json({ products: products, message: "producto actualizado" });
});

//carts
app.get('/api/carts/:id', async(req, res)=> {
  const cartId = req.params.id;
  const carts = await cartManager.getCartById(cartId);
  res.status(200).json({ carts: carts, message: "carrito por id" });
});

app.post('/api/carts', async(req, res)=> {
  const newCart = req.body;
  const carts = await cartManager.createCart(newCart);
  res.status(201).json({ carts: carts, message: "nuevo carrito creado" });
});

app.post('/api/carts/:id/product/:id', async(req, res)=> {
  const newCart = req.body;
  const carts = await cartManager.updateCart(newCart);
  res.status(201).json({ carts: carts, message: "carrito modificado" });
});

io.on('connection', socket => {
  console.log(`Cliente conectado: ${socket.id}`);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, ()=> console.log(`Servidor iniciado en: http://localhost:${PORT}`) );