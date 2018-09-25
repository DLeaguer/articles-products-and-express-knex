console.log(`\nstart routes/users.js`);
console.log(` connect require/assign`);
const express = require('express');
const Router = express.Router();

console.log(` connect db`);
const Users = require('../db/users.js');
const Users_Inv = new Users();
const knex = require('../knex/knex.js');

//RENDER LOGIN 
let authorized = false;
Router.get('/users/login', (req, res) => {
  console.log('LOGIN authorize false render user-login');
  res.render('user-login');
});

Router.get('/users/logout', (req, res) => {
  authorized = false;
  console.log('LOGOUT authorize false redirect /home');
  res.redirect('/');
});

//AUTHORIZE 
Router.post('/users/login', (req, res) => {
  const info = req.body;
  // const user = Users_Inv.getUserByInfo(info.username, info.password);
  const namepass = info.username
  console.log('namepass =', namepass);
  const wordpass = info.password
  console.log('wordpass =', wordpass);
  knex.raw('SELECT * FROM users')
    .then( result => {
      console.log('result.rows =', result.rows);
    })
    .catch( err => {
      console.log('error', err);
    });
  knex.raw(`SELECT * FROM users WHERE username = '${namepass}' AND password = '${wordpass}'`)
    .then( result => {
      console.log('result.rows[0] =', result.rows[0]);
      console.log('result.rows[0].username =', result.rows[0].username);
      console.log('result.username =', result.username);
      console.log('result.namepass =', result.namepass);
      console.log('namepass =', namepass);
      if (result.rows[0].username == namepass && result.rows[0].password == wordpass) {
        authorized = true;
        console.log('AUTHORIZE true redirect /users');
        res.redirect('/users');
      }
      else {
        console.log('AUTHORIZE false redirect /users/login');
        res.redirect('/users/login');
      }
    })
    
    .catch( err => {
      console.log('error', err);
    });
});

//RENDER ALL
Router.get('/users', (req, res) => {
  if (!authorized) {
    console.log('ALL authorize false redirect /users/login');
    res.redirect('/users/login');
  }
  else {
    // const users = Users_Inv.all();
    // console.log('ALL render users');
    // res.render('users', { users });
  knex.raw(`SELECT * FROM users`)
  .then( result => {
    const users = result.rows
        console.log('ALL render users');
        res.render('users', { users });
      })
      .catch( err => {
        console.log('error', err);
      });
  }
});

//RENDER FORM 
Router.get('/users/new', (req, res) => {
  if (!authorized) {
    console.log('FORM authorize false redirect /users/login');
    res.redirect('/users/login');
  }
  else {
    console.log(`FORM render user-form`);
    res.render('user-form');
  }
});

Router.get('/users/:id/edit', (req, res) => {
  if (!authorized) {
    console.log('FORM authorize false redirect /users/login');
    res.redirect('/users/login');
  }
  else {
    const { id } = req.params;
    // let userToEdit = Users_Inv.getUserById(id);
    knex.raw( `SELECT * FROM users WHERE id = ${id}`)
      .then( result => {
        const userToEdit = result.rows[0]
        console.log(`FORM render edit`);
        res.render('edit', { userToEdit});
      })
      .catch( err => {
        console.log('error', err);
      });
  }
});

//RENDER DETAIL 
Router.get('/users/:id', (req, res) => {
  if (!authorized) {
    console.log('DETAIL authorize false redirect /users/login');
    res.redirect('/users/login');
  }
  else {
    const{ id } = req.params;
    // const user = Users_Inv.getUserById(id);
    knex.raw(`SELECT * FROM users WHERE id = ${id}`)
      .then( result => {
        const user = result.rows[0]
        console.log(`DETAIL render users-detail`);
        res.render('user-detail', user);
      })
      .catch( err => {
        console.log('error', err);
      });
  }
});

//ADD 
Router.post('/users/new', (req, res) => {
  if (!authorized) {
    console.log('ADD authorize false redirect /users/login');
    res.redirect('/users/login');
  }
  else {
    const user = req.body;
    // Users_Inv.add(user);
    knex.raw(`INSERT INTO users (username, password) VALUES ('${user.username}', '${user.password}')`)
      .then( result => {
        console.log(`ADD render users`);
        res.redirect('/users');
      })
      .catch( err => {
        console.log('error', err);
      });
  }
});

//REMOVE 
Router.delete('/users/:id', (req, res) => {
  if (!authorized) {
    console.log('DELETE authorize false redirect /users/login');
    res.redirect('/users/login');
  }
  else {
    const { id } = req.params;
    // const deleteUser = Users_Inv.deleteUserById(id);
    knex.raw(`DELETE FROM users WHERE id = ${id}`)
      .then( result => {
        console.log(`DELETE render users`);
        res.redirect('/users');
      })
      .catch( err => {
        console.log('error', err);
      });
  }
});

//EDIT 
Router.put('/users/:id', (req, res) => {
  if (!authorized) {
    console.log('EDIT authorize false redirect /users/login');
    res.redirect('/users/login');
  }
  else {
    const { id } = req.params;
    const user = req.body;
    console.log('user.username =', user.username);
    console.log('user.password =', user.password);
    knex.raw(`UPDATE users SET username = '${user.username}', password = '${user.password}' WHERE id = ${id}`)
      .then( result => {
      console.log('EDIT redirect /users/${id}');
      res.redirect(`/users/${id}`);
      })
      .catch( err => {
        console.log('error', err);
      });
    // let userToEdit = Users_Inv.getUserById(id);
    // if (req.body.username !== userToEdit.username) {
    //   userToEdit.username = req.body.username;
    // }
    // if (req.body.password !== userToEdit.password) {
    //   userToEdit.password = req.body.password;
    // }
  }
});

module.exports = Router;
console.log(`end routes/users.js`)