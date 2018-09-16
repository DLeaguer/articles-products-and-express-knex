const express = require('express');
const Router = express.Router();

//Gets add() from .js
const Products = require('../db/product.js');
const Products_Inv = new Products();
const Users = require('../db/users.js');
const Users_Inv = new Users();
const knex = require('../knex/knex.js');

//RENDER LOGIN 
let authorized = false;
Router.get('/products/login', (req, res) => {
  console.log('render productsLogin');
  res.render('productsLogin');
});

Router.get('/products/logout', (req, res) => {
  authorized = false;
  res.redirect('/');
});

//AUTHORIZE 
Router.post('/products/login', (req, res) => {
  console.log('authorize start routes/product.js');
  console.log('req.body =', req.body);
  const info = req.body;
  console.log('info =', info);
  const user = Users_Inv.getUserByInfo
  (info.username, info.password);
  console.log('user =', user);
  if (user === undefined) {
    res.redirect('/products/login');
  }
  else {
    authorized = true;
    console.log('authorize true redirect /productsHome');
    res.redirect('/productsHome');
  }
});

//RENDER ALL
Router.get('/productsHome', (req, res) => {
    const allProducts = Products_Inv.all()
      .then( results => {
        console.log('routes/product.js results.rows =', results.rows)
        const products = results.rows
        res.render('productsHome', { products });
      })
      .catch( err => {
        console.log('error', err);
      });
});

//RENDER FORM 
Router.get('/products/new', (req, res) => {
  if (!authorized) {
    res.redirect('/products/login');
  }
  else {
    res.render('products-form');
  }
});

Router.get('/products/:id/edit', (req, res) => {
  if (!authorized) {
    res.redirect('/products/login');
  }
  else {
    console.log('edit is here routes/product.js');
    const { id } = req.params;
    console.log('id in routes/product.js =', id);
    knex.raw(`SELECT * FROM products WHERE id = ${id}`)
    .then( result => {
      const productToEdit = result.rows[0]
      console.log('productToEdit =', productToEdit);
      res.render('edit', { productToEdit });
    })
    .catch( err => {
      console.log('error', err)
    })
  }
});

//RENDER DETAIL 
Router.get('/products/:id', (req, res) => {
    const { id } = req.params;
    knex.raw(`SELECT * FROM products WHERE id = ${id}`)
      .then( result => {
        const product = result.rows[0]
        res.render('product-detail',  product);
      })
      .catch( err => {
        console.log('error', err);
      });
});

//ADD 
Router.post('/products/new', (req, res) => {
  if (!authorized) {
    res.redirect('/products/login');
  }
  else {
    const product = req.body;
    knex.raw(`INSERT INTO products (product, price, inventory) VALUES ('${product.product}', '${product.price}', '${product.inventory}')`)
      .then( results =>  {
        console.log('^ post redirecting to Router.get "/productsHome"');
        res.redirect('/productsHome');
      })
      .catch( err => {
        console.log('error', err)
        console.log('^ post redirecting to Router.get "/productsHome"');
        res.redirect('/productsHome');
      });
  }
});

//REMOVE  
Router.delete('/products/:id', (req, res) => {
  if (!authorized) {
    res.redirect('/products/login');
  }
  else {
    const { id } = req.params;
    console.log(' id = ', id);
    // Products_Inv.deleteProductById(id);
    knex.raw(`DELETE FROM products WHERE id = ${id}`)
      .then( result => {
        console.log('DID you DELETE');
        res.redirect('/productsHome');
      })
      .catch( err => {
        console.log('error', err);
      });
  }
});

//EDIT  
Router.put('/products/:id', (req, res) => {
  if (!authorized) {
    res.redirect('/products/login');
  }
  else {
    console.log('edit started routes/product.js');
    const { id } = req.params;
    console.log('req.body =', req.body);
    knex.raw(`UPDATE products SET product = '${req.body.product}', price = ${req.body.price}, inventory = ${req.body.inventory} WHERE id = ${id}`)
      .then( result => {
        res.redirect(`/products/${id}`);
      })
      .catch( err => {
        console.log('error', err)
      });
  }
});

module.exports = Router;