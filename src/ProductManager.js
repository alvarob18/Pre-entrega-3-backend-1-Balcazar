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


  // Obtiene todos los usuarios
  getAllProducts = async() => {
    // Lee el archivo .json
    const productsJson = await fs.promises.readFile(this.path, 'utf-8');
    // Convierte el contenido de JSON a un array de usuarios
    const products = JSON.parse(productsJson);
    // Devuelve el array de usuarios
    return products;
  }

  // Obtiene un usuario por su id
  getProductById = async(productId) => {
    // Lee el archivo .json
    const productsJson = await fs.promises.readFile(this.path, 'utf-8');
    // Convierte el contenido de JSON a un array de usuarios
    const products = JSON.parse(productsJson);
    // Busca el usuario con el id proporcionado
    const product = products.find((productData) => productData.id == productId);
    // Devuelve el usuario encontrado
    return product;
  }

  // Crea un nuevo usuario
  createProduct = async(newProduct) => {
    // Lee el archivo .json
    const productsJson = await fs.promises.readFile(this.path, 'utf-8');
    // Convierte el contenido de JSON a un array de usuarios
    const products = JSON.parse(productsJson);
    // Genera un id único para el nuevo usuario
    const id = this.generateId(products);
    // Añade el nuevo usuario al array, con el id generado
    products.push({ id, ...newProduct });
    // Sobreescribe el archivo .json con la lista actualizada
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
    // Devuelve la lista actualizada de usuarios
    return products;
  }

  updateProductById = async(productId, updatedData) => {
    const productsJson = await fs.promises.readFile(this.path, 'utf-8');
    const products = JSON.parse(productsJson);
    const index = products.findIndex(product => product.id == productId);
    products[index] = { ...products[index], ...updatedData };
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');

    return products;
  }

  // Elimina un usuario por su id
  deleteProductById = async(productId) => {
    // Lee el archivo .json
    const productsJson = await fs.promises.readFile(this.path, 'utf-8');
    // Convierte el contenido de JSON a un array de usuarios
    const products = JSON.parse(productsJson);
    // Filtra los usuarios, eliminando el que tiene el id proporcionado
    const productsFilter = products.filter((productData) => productData.id != productId);
    // Sobreescribe el archivo .json con la lista filtrada
    await fs.promises.writeFile(this.path, JSON.stringify(productsFilter, null, 2), 'utf-8');
    // Devuelve la lista filtrada de usuarios
    return productsFilter;
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
}

export default ProductManager;