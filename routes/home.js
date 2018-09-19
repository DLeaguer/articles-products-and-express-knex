console.log(`\nstart routes/home.js`)
const express = require('express');
console.log(`connected required`);
const Router = express.Router();
console.log(`assigned express.Router to Router`);

const Users = require('../db/users.js');
const Users_Inv = new Users();
const knex = require('../knex/knex.js');
console.log(`connected folders`);

//RENDER HOME 
let authorized = false;
Router.get('/', (req, res) => {
  if (!authorized) {
  console.log('HOME authorize false render login.hbs');
  res.redirect('/login');
  }
  else {
    console.log('HOME authorize true render home.hbs');
    res.render('home');
  }
});

//RENDER LOGIN 
Router.get('/login', (req, res) => {
  console.log('LOGIN authorize false render login.hbs');
  res.render('login');
});

Router.get('/logout', (req, res) => {
  authorized = false;
  console.log('LOGOUT authorize false render login.hbs')
  res.render('login');
});

//AUTHORIZE 
Router.post('/login', (req, res) => {
  const info = req.body;
  const user = Users_Inv.getUserByInfo(info.username, info.password);
  if (user == undefined) {
    console.log('AUTHORIZE false redirect /login');
    res.redirect('/login');
  }
  else {
    authorized = true;
    console.log('AUTHORIZE true redirect /home');
    res.render('home');
  }
});

module.exports = Router;
console.log(`end routes/home.js`)
