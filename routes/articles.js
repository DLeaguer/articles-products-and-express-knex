const express = require('express');
const Router = express.Router();

//Gets add() from .js
const Articles = require('../db/articles.js');
const Articles_Inv = new Articles(); // articles.js add()
const Users = require('../db/users.js');
const Users_Inv = new Users();
const knex = require('../knex/knex.js');

//RENDER LOGIN 
let authorized = false;
Router.get('/articles/login', (req, res) => {
  res.render('articlesLogin');
});

Router.get('/articles/logout', (req, res) => {
  authorized = false;
  res.redirect('/');
});

//AUTHORIZE 
Router.post('/articles/login', (req, res) => {
  const info = req.body;
  const user = Users_Inv.getUserByInfo(info.username, info.password);
  if (user == undefined) {
    res.redirect('/articles/login');
  }
  else {
    authorized = true;
    res.redirect('/articlesHome');
  }
});

//RENDER ALL 
Router.get('/articlesHome', (req, res) => {
    // const allArticles = Articles_Inv.all();
    knex.raw(`SELECT * FROM articles`)
      .then( result => {
        const articles = result.rows
        res.render('articlesHome', { articles });
      })
      .catch( err => {
        console.log('error', err);
      });
});

//RENDER FORM
Router.get('/articles/new', (req, res) => {
  if (!authorized) {
    res.redirect('/articles/login');
  }
  else {
    res.render('article-form');
  }
});

Router.get('/articles/:id/edit', (req, res) => {
  if (!authorized) {
    res.redirect('/articles/login');
  }
  else {
    const { id } = req.params;
    // let articleToEdit = Articles_Inv.getItemById(id);
    knex.raw(`SELECT * FROM articles WHERE id = ${id}`)
      .then( result => {
        const articleToEdit = result.rows[0]
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
        res.render('article-detail', article);
      })
      .catch( err => {
        console.log('error', err);
      }); 
});

//ADD 
Router.post('/articles/new', (req, res) => {
  if (!authorized) {
    res.redirect('/articles/login');
  }
  else {
    const article = req.body;
    // Articles_Inv.add(article);
    knex.raw(`INSERT INTO articles (title, body, author) VALUES ('${article.title}', '${article.body}', '${article.author}')`)
      .then( result => {
        res.redirect('/articlesHome');
      })
      .catch( err => {
        console.log('error', err);
      });
  }
});

//REMOVE 
Router.delete('/articles/:id', (req, res) => {
  if (!authorized) {
    res.redirect('/articles/login');
  }
  else {
    const { id } = req.params;
    // Articles_Inv.deleteArticleById(id);
    knex.raw(`DELETE FROM articles WHERE id = ${id}`)
      .then( result => {
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
    res.redirect('/articles/login');
  }
  else {
    const { id } = req.params;
    const article = req.body;
    knex.raw(`UPDATE articles SET title = '${article.title}', body = '${article.body}', author = '${article.author}'`)
      .then( result => {
        res.redirect(`/articles/${id}`);
      })
      .catch( err => {
        console.log('error', err);
      });
  }
});

module.exports = Router;