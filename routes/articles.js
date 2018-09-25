console.log(`\nstart routes/articles.js`);
console.log(` connect require/assign`);
const express = require('express');
const Router = express.Router();

console.log(` connect db`);
const Users = require('../db/users.js');
const Users_Inv = new Users();
const knex = require('../knex/knex.js');

//RENDER LOGIN 
let authorized = false;
Router.get('/articles/login', (req, res) => {
  console.log('LOGIN authorize false render articlesLogin');
  res.render('articlesLogin');
});

Router.get('/articles/logout', (req, res) => {
  authorized = false;
  console.log('LOGOUT authorize false redirect /home');
  res.redirect('/');
});

//AUTHORIZE 
Router.post('/articles/login', (req, res) => {
  const info = req.body;
  // const user = Users_Inv.getUserByInfo(info.username, info.password);
  const namepass = info.username
  const wordpass = req.body.password
  knex.raw(`SELECT * FROM users WHERE username = '${namepass}' AND password = '${wordpass}'`)
    .then( result => {
      console.log('result.rows =', result.rows);
      if (namepass == result.rows[0].username && wordpass == result.rows[0].password) {
        authorized = true;
        console.log('AUTHORIZE true redirect /articlesHome');
        res.redirect('/articlesHome');
      }
      else {
        console.log('AUTHORIZE false redirect /articles/login');
        res.redirect('/articles/login');
      }
    })
    .catch( err => {
      console.log('error', err);
    });
});

//RENDER ALL 
Router.get('/articlesHome', (req, res) => {
    knex.raw(`SELECT * FROM articles`)
      .then( result => {
        const articles = result.rows
        console.log('ALL render articlesHome');
        res.render('articlesHome', { articles });
      })
      .catch( err => {
        console.log('error', err);
      });
});

//RENDER FORM
Router.get('/articles/new', (req, res) => {
  if (!authorized) {
    console.log('FORM authorize false redirect /articles/login');
    res.redirect('/articles/login');
  }
  else {
    console.log(`FORM render article-form`);
    res.render('article-form');
  }
});

Router.get('/articles/:id/edit', (req, res) => {
  if (!authorized) {
    console.log('FORM authorize false redirect /articles/login');
    res.redirect('/articles/login');
  }
  else {
    const { id } = req.params;
    knex.raw(`SELECT * FROM articles WHERE id = ${id}`)
      .then( result => {
        const articleToEdit = result.rows[0]
        console.log('FORM render edit');
        res.render('edit', { articleToEdit });
      })
      .catch( err => {
        console.log('error', err);
      });
  }
});

//RENDER DETAIL
Router.get('/articles/:id', (req, res) => {
    const{ id } = req.params;
    // const article = Articles_Inv.getItemById(id);
    knex.raw(`SELECT * FROM articles WHERE id = ${id}`)
      .then( result => {
        const article = result.rows[0]
        console.log('DETAIL render article-detail');
        res.render('article-detail', article);
      })
      .catch( err => {
        console.log('error', err);
      }); 
});

//ADD 
Router.post('/articles/new', (req, res) => {
  if (!authorized) {
    console.log('ADD authorize false redirect /articles/login');
    res.redirect('/articles/login');
  }
  else {
    const article = req.body;
    knex.raw(`INSERT INTO articles (title, body, author) VALUES ('${article.title}', '${article.body}', '${article.author}')`)
      .then( result => {
        console.log('ADD product redirect /articlesHome');
        res.redirect('/articlesHome');
      })
      .catch( err => {
        console.log('error', err);
        console.log('ADD error redirect /articlesHome');
        rex.redirect('/articlesHome');
      });
  }
});

//REMOVE 
Router.delete('/articles/:id', (req, res) => {
  if (!authorized) {
    console.log('DELETE authorize false redirect /articles/login');
    res.redirect('/articles/login');
  }
  else {
    const { id } = req.params;
    // Articles_Inv.deleteArticleById(id);
    knex.raw(`DELETE FROM articles WHERE id = ${id}`)
      .then( result => {
        console.log('DELETE article redirect /articlesHome');
        res.redirect('/articlesHome');
      })
      .catch( err => {
        console.log('error', err);
      });
  }
})

//EDIT 
Router.put('/articles/:id', (req, res) => {
  if (!authorized) {
    console.log('EDIT authorize false redirect /articles/login');
    res.redirect('/articles/login');
  }
  else {
    const { id } = req.params;
    const article = req.body;
    knex.raw(`UPDATE articles SET title = '${article.title}', body = '${article.body}', author = '${article.author}' WHERE id = ${id}`)
      .then( result => {
        console.log('EDIT article redirect /articles/${id}');
        res.redirect(`/articles/${id}`);
      })
      .catch( err => {
        console.log('error', err);
      });
  }
});

module.exports = Router;
console.log(`end routes/article.js`);