console.log(`\nstart routes/product.js`);
console.log(` connect require/assign`);
const express = require('express');
const Router = express.Router();

console.log(` connect db`); 
const Users = require('../db/users.js');
const Users_Inv = new Users();
const knex = require('../knex/knex.js');

//RENDER LOGIN 
let authorized = false;
Router.get('/products/login', (req, res) => {
  console.log('LOGIN authorize false render productsLogin');
  res.render('productsLogin');
});

Router.get('/products/logout', (req, res) => {
  authorized = false;
  console.log('LOGOUT authorize false redirect /home')
  res.redirect('/');
});

//AUTHORIZE 
Router.post('/products/login', (req, res) => {
  const info = req.body;
  // const user = Users_Inv.getUserByInfo
  // (info.username, info.password);
  const namepass = req.body.username
  const wordpass = req.body.password
  knex.raw(`SELECT * FROM users WHERE username = '${namepass}' AND password = '${wordpass}'`)
    .then( result => {
      console.log('result.rows =', result.rows);
      if (result.rows[0].username == namepass && result.rows[0].password == wordpass) {
        authorized = true;
        console.log('AUTHORIZE true redirect /productsHome');
        res.redirect('/productsHome');
      }
      else {
        console.log('AUTHORIZE false redirect /products/login');
        res.redirect('/products/login');
      }
    })
});

//RENDER ALL
Router.get('/productsHome', (req, res) => {
  knex.raw(`SELECT * FROM products`)
  .then( result => {
    const products = result.rows
        console.log('ALL render productsHome');
        res.render('productsHome', { products });
      })
      .catch( err => {
        console.log('error', err);
      });
});

//RENDER FORM 
Router.get('/products/new', (req, res) => {
  if (!authorized) {
    console.log('FORM redirect /products/login');
    res.redirect('/products/login');
  }
  else {
    console.log(`FORM render products-form`);
    res.render('products-form');
  }
});

Router.get('/products/:id/edit', (req, res) => {
  if (!authorized) {
    console.log('FORM redirect /products/login');
    res.redirect('/products/login');
  }
  else {
    const { id } = req.params;
    knex.raw(`SELECT * FROM products WHERE id = ${id}`)
    .then( result => {
      const productToEdit = result.rows[0]
      console.log('FORM render edit');
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
        console.log('DETAIL render product-detail');
        res.render('product-detail',  product);
      })
      .catch( err => {
        console.log('error', err);
      });
});

//ADD 
Router.post('/products/new', (req, res) => {
  if (!authorized) {
    console.log('ADD authorize false redirect /products/login');
    res.redirect('/products/login');
  }
  else {
    const product = req.body;
    knex.raw(`INSERT INTO products (product, price, inventory) VALUES ('${product.product}', '${product.price}', '${product.inventory}')`)
      .then( results =>  {
        console.log('ADD product redirect /productsHome');
        res.redirect('/productsHome');
      })
      .catch( err => {
        console.log('error', err)
        console.log('ADD error redirect /productsHome');
        res.redirect('/productsHome');
      });
  }
});

//REMOVE  
Router.delete('/products/:id', (req, res) => {
  if (!authorized) {
    console.log('DELETE authorize false redirect /products/login');
    res.redirect('/products/login');
  }
  else {
    const { id } = req.params;
    knex.raw(`DELETE FROM products WHERE id = ${id}`)
      .then( result => {
        console.log('DELETE product redirect /productsHome');
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
    console.log('EDIT authorize false redirect /products/login');
    res.redirect('/products/login');
  }
  else {
    const { id } = req.params;
    knex.raw(`UPDATE products SET product = '${req.body.product}', price = ${req.body.price}, inventory = ${req.body.inventory} WHERE id = ${id}`)
    .then( result => {
        console.log('EDIT product redirect /products/${id}');
        res.redirect(`/products/${id}`);
      })
      .catch( err => {
        console.log('error', err)
      });
  }
});

module.exports = Router;
console.log(`end routes/product.js`)
