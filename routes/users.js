console.log(`\nstart routes/users.js`)
const express = require('express');
console.log(`connected required`);
const Router = express.Router();
console.log(`assigned express.Router() to Router`);

const Users = require('../db/users.js');
const Users_Inv = new Users();
console.log(`connected folders`);

//RENDER LOGIN 
Router.get('/users/login', (req, res) => {
  console.log('LOGIN authorize false render login.hbs');
  res.render('user-login');
});

Router.get('/users/logout', (req, res) => {
  authorized = false;
  console.log('LOGOUT authorize false render login.hbs');
  res.redirect('/');
});

//AUTHORIZE 
Router.post('/users/login', (req, res) => {
  const info = req.body;
  const user = Users_Inv.getUserByInfo(info.username, info.password);
  if (user === undefined) {
    console.log('AUTHORIZE false render login.hbs');
    res.redirect('/users/login');
  }
  else {
    authorized = true;
    console.log('AUTHORIZE true render users.hbs');
    res.render('users');
  }
});

//RENDER ALL
Router.get('/users', (req, res) => {
  if (!authorized) {
    console.log('FORM authorize false render login.hbs');
    res.redirect('/users/login');
  }
  else {
    const users = Users_Inv.all();
    res.render('users', { users });
  // knex.raw(`SELECT * FROM users`)
  // .then( result => {
  //   const users = result.rows
  //       console.log('ALL render users.hbs');
  //       res.render('users', { users });
  //     })
  //     .catch( err => {
  //       console.log('error', err);
  //     });
  }
});

//RENDER FORM 
let authorized = true;
Router.get('/users/new', (req, res) => {
  if (!authorized) {
    console.log('FORM authorize false render login.hbs');
    res.redirect('/users/login');
  }
  else {
    console.log(`FORM render users-form.hbs`);
    res.render('user-form');
  }
});

Router.get('/users/:id/edit', (req, res) => {
  if (!authorized) {
    console.log('FORM authorize false render login.hbs');
    res.redirect('/users/login');
  }
  else {
    const { id } = req.params;
    let userToEdit = Users_Inv.getUserById(id);
    console.log(`FORM render edit.hbs`);
    res.render('edit', { userToEdit});
  }
});

//RENDER DETAIL 
Router.get('/users/:id', (req, res) => {
  if (!authorized) {
    console.log('DETAIL authorize false render login.hbs');
    res.redirect('/users/login');
  }
  else {
    const { id } = req.params;
    const user = Users_Inv.getUserById(id);
    console.log(`DETAIL render users.hbs`);
    res.render('user-detail', user);
  }
});

//ADD 
Router.post('/users/new', (req, res) => {
  if (!authorized) {
    console.log('ADD authorize false render login.hbs');
    res.redirect('/users/login');
  }
  else {
    const user = req.body;
    Users_Inv.add(user);
    console.log(`ADD render users-form.hbs`);
    res.redirect('/users');
  }
});

//REMOVE 
Router.delete('/users/:id', (req, res) => {
  if (!authorized) {
    console.log('DELETE authorize false render login.hbs');
    res.redirect('/users/login');
  }
  else {
    const { id } = req.params;
    const deleteUser = Users_Inv.deleteUserById(id);
    console.log(`DELETE render users.hbs`);
    res.redirect('/users');
  }
});

//EDIT 
Router.put('/users/:id', (req, res) => {
  if (!authorized) {
    console.log('EDIT authorize false render login.hbs');
    res.redirect('/users/login');
  }
  else {
    const { id } = req.params;
    let userToEdit = Users_Inv.getUserById(id);
    if (req.body.username !== userToEdit.username) {
      userToEdit.username = req.body.username;
    }
    if (req.body.password !== userToEdit.password) {
      userToEdit.password = req.body.password;
    }
    console.log('EDIT redirect /users/${id}');
    res.redirect(`/users/${id}`);
  }
});

module.exports = Router;
console.log(`end routes/users.js`)