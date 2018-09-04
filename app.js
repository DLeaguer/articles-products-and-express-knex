const express = require('express');
const exphbs = require('express-handlebars');
const bp = require('body-parser');
const methodOverride = require('method-override');

const Products = require('./db/product.js');
const Products_Inv = new Products(); // products.js add
const Articles = require('./db/articles.js');
const Articles_Inv = new Articles(); // articles.js add

const app = express();

app.use(express.static('public'));
app.use(bp.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use((req, res, next) => {
  console.log(`\n${req.method} request at: ${req.url}`);
  next();
});

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// ROUTES below will not be used until called upon

//render all items
app.get('/', (req, res) => {
  const proditem = Products_Inv.all();
  const artitem = Articles_Inv.all();
  res.render('home', {proditem, artitem});
});


//render out the form
app.get('/products/new', (req, res) => {
  res.render('products-form');
});

app.get('/articles/new', (req, res) => {
  res.render('article-form');
});

//rendor out detail
app.get('/products/:id/edit', (req, res) => {
  console.log('edit is here')
  const { id } = req.params;
  let productToEdit = Products_Inv.getItemById(id);
  res.render('edit', { productToEdit });
});

app.get('/articles/:id/edit', (req, res) => {
  const { id } = req.params;
  let articleToEdit = Articles_Inv.getItemById(id);
  res.render('edit', { articleToEdit });
});

app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const product = Products_Inv.getItemById(id);
  res.render('product-detail',  product);
});

app.get('/articles/:id', (req, res) => {
  const{ id } = req.params;
  const article = Articles_Inv.getItemById(id);
  res.render('article-detail', article);
});

// add item
app.post('/products/new', (req, res) => {
  const product = req.body;
  Products_Inv.add(product);
  console.log('^ post redirecting to app.get "/"');
  res.redirect('/');
});

app.post('/articles/new', (req, res) => {
  const article = req.body;
  Articles_Inv.add(article);
  res.redirect('/');
});

// delete item
app.get('/products/:id/removeProduct', (req, res) => {
  console.log('delete is here')
  const { id } = req.params;
  const deleteProduct = Products_Inv.deleteProductById(id);
  res.render('removeProduct', { deleteProduct });
})

app.get('/articles/:id/removeArticle', (req, res) => {
  const { id } = req.params;
  const deleteArticle = Articles_Inv.deleteArticleById(id);
  res.render('removeArticle', { deleteArticle });
})

// edit item
app.put('/products/:id', (req, res) => {
  console.log('req.body =', req.body);
  console.log('req.params =', req.params);
  const { id } = req.params;
  let productToEdit = Products_Inv.getItemById(id);
  console.log('productToEdit =\n', productToEdit);
  if (req.body.product !== productToEdit.product) {
    productToEdit.product = req.body.product;
  }
  if (req.body.price !== productToEdit.price) {
    productToEdit.price = req.body.price;
  }
  if ( req.body.inventory !== productToEdit.inventory) {
    productToEdit.inventory = req.body.inventory;
  }
  res.redirect(`/products/${id}`);
});

app.put('/articles/:id', (req, res) => {
  const { id } = req.params;
  let articleToEdit = Articles_Inv.getItemById(id);
  if (req.body.title !== articleToEdit.title) {
    articleToEdit.title = req.body.title;
  }
  if (req.body.body !== articleToEdit.body) {
    articleToEdit.body = req.body.body;
  }
  if ( req.body.author !== articleToEdit.author) {
    articleToEdit.author = req.body.author;
  }
  res.redirect(`/articles/${id}`);
});

// error page
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/404.html')
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port: ${process.env.PORT}`)});
