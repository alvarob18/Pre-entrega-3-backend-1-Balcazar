import express from 'express';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import { engine } from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import path from 'path';

const app = express();
const httpServer = createServer(app);
const io = new SocketIO(httpServer);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve('./src/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('./public')));

app.use('/', viewsRouter(io));
app.use('/api/products', productsRouter(io));

io.on('connection', socket => {
  console.log(`Cliente conectado: ${socket.id}`);
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => console.log(`Server en ${PORT}`));