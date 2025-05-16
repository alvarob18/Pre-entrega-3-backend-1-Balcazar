import fs from 'fs';

class CartManager {
  constructor(){
    this.path = './src/carts.json';
    this.pathProducts = './src/products.json';
  }

  generateId = (carts) => {
    if (carts.length > 0) {
      return carts[carts.length - 1].id + 1;
    } else {
      return 1;
    }
  }

  getCartById = async(cartId) => {
    const cartsJson = await fs.promises.readFile(this.path, 'utf-8');
    const carts = JSON.parse(cartsJson);
    const cart = carts.find((cartData) => cartData.id == cartId);
    return cart;
  }

  createCart = async (newCart) => {
    const cartsJson = await fs.promises.readFile(this.path, 'utf-8');
    const carts = JSON.parse(cartsJson);
    const productsJson = await fs.promises.readFile(this.pathProducts, 'utf-8');
    const products = JSON.parse(productsJson);

    const productIds = newCart.productIds || [];
    const cartProducts = productIds
      .map(pid => products.find(p => p.id === pid))
      .filter(p => p !== undefined);

    const id = this.generateId(carts);
    const newCartData = {
      id,
      products: cartProducts
    };

    carts.push(newCartData);

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');

    return carts;
  }

  updateCart = async (newCart) => {
    const cartsJson = await fs.promises.readFile(this.path, 'utf-8');
    const carts = JSON.parse(cartsJson);

    const productsJson = await fs.promises.readFile(this.pathProducts, 'utf-8');
    const products = JSON.parse(productsJson);

    const cartId = newCart.cartId;
    const productId = newCart.productId;

    const cartIndex = carts.findIndex(cart => cart.id === cartId);

    const productData = products.find(p => p.id === productId);

    const cart = carts[cartIndex];
    const existingProductIndex = cart.products.findIndex(p => p.id === productId);

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += 1;
    } else {
      cart.products.push({ ...productData, quantity: 1 });
    }

    carts[cartIndex] = cart;

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');

    return cart;
  }
}

export default CartManager;