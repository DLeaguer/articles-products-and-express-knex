console.log('\nclass Products Started in product.js');
class Products {
  constructor() {
    this.knex = require('../knex/knex.js');
    this._count = 1;
    this._storage = [];
    this.add({
      product: "Apples",
      price: 0.99,
      inventory: 200,
    });
  }
  all() {
    return this.knex.raw('SELECT * FROM products');
  }
  getItemById(id) {
    return this._storage.filter(product => id == product.id)[0];
  }
  add(product) {
    product.id = this._count;
    this._storage.push(product);
    this._count++;
    return product.id;
  }

  deleteProductById(id) {
    this.knex.raw(`DELETE FROM products WHERE id = ${id}`)
      .then( result => {
      })
      .catch( err => {
        console.log('error', err)
      })
  }
}

module.exports = Products;

console.log('class Products Ended in product.js');
