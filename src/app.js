import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from "socket.io";
import http from "http";
import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
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

connectMongoDB();

//endpoints
app.get('/home', (req, res)=> {
  res.send("Hola mundo desde express!");
});

io.on('connection', socket => {
  console.log(`Cliente conectado: ${socket.id}`);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, ()=> console.log(`Servidor iniciado en: http://localhost:${PORT}`) );