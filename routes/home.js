console.log(`\nstart routes/home.js`)
console.log(` connect require/assign`);
const express = require('express');
const Router = express.Router();

console.log(` connect db`);
// const Users = require('../db/users.js');
// const Users_Inv = new Users();
const knex = require('../knex/knex.js');

//RENDER HOME 
let authorized = false;
Router.get('/', (req, res) => {
  // if (!authorized) {
  // console.log('HOME authorize false render login.hbs');
  // res.redirect('/login');
  // }
  // else {
  //   console.log('HOME authorize true render home.hbs');
    res.render('home');
  // }
});

//RENDER LOGIN 
Router.get('/login', (req, res) => {
  if (!authorized) {
    console.log('LOGIN authorize false render login.hbs');
    res.render('login');
  }
  else {
    res.redirect('/productsHome');
  }
});

Router.get('/logout', (req, res) => {
  authorized = false;
  console.log('LOGOUT authorize false render login.hbs')
  res.render('login');
});

//AUTHORIZE 
Router.post('/login', (req, res) => {
  // const info = req.body;
  // const user = Users_Inv.getUserByInfo(info.username, info.password);
  const { username } = req.body
  const { password } = req.body
  knex.raw(`SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`)
  .then( result => {
    if (username == undefined && password == undefined) {
      console.log('AUTHORIZE false redirect /login');
      res.redirect('/login');
    }
    else {
      authorized = true;
      console.log('AUTHORIZE true redirect /home');
      res.redirect('/productsHome');
    }
  })
  .catch( err => {
    console.log('error', err);
  });
});

module.exports = Router;
console.log(`end routes/home.js`)
