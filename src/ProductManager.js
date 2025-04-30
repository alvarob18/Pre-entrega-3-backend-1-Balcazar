import fs from 'fs'

class ProductManager {
  constructor() {
    this.path = './src/Products.json';
  }

  generateNewId = (products) => {
    if (products.length > 0) {
      return products[products.length - 1].id + 1;
    } else {
      return 1;
    }
  }

  getProducts = async() => {
    const productsJson = await fs.promises.readFile(this.path, 'utf-8');
    const products = JSON.parse(productsJson);
    return products;
  }

  addProduct = async(newProduct) => {
    const productsJson = await fs.promises.readFile(this.path, 'utf-8');
    const products = JSON.parse(productsJson);

    const id = this.generateNewId(products);
    products.push({ id , ...newProduct });

    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8' );
    return products;
  }

  deleteProductById = async(productId) => {
    const productsJson = await fs.promises.readFile(this.path, 'utf-8');
    const products = JSON.parse(productsJson);
    const productsFilter = products.filter((productData) => productData.id != productId);
    await fs.promises.writeFile(this.path, JSON.stringify(productsFilter, null, 2), 'utf-8');

    return productsFilter;
  }
}

export default ProductManager;