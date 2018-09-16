const express = require('express');
const exphbs = require('express-handlebars');
const bp = require('body-parser');
const methodOverride = require('method-override');

//Use db folder
//Gets add() from .js
const Products = require('./db/product.js');
const Products_Inv = new Products();
const Articles = require('./db/articles.js');
const Articles_Inv = new Articles(); 
const Users = require('./db/users.js');
const Users_Inv = new Users();
const knex = require('./knex/knex.js');
console.log('end db folders');

//Use routes folder
const productRoutes = require('./routes/product.js');
const articleRoutes = require('./routes/articles.js');
console.log('end articleRoutes');
const userRoutes = require('./routes/users.js');
console.log('end routes folder');

//Use app for all express methods
const app = express();

//middleware
app.use(express.static('public'));
app.use(bp.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use((req, res, next) => {
  console.log(`\n${req.method} request at: ${req.url}`);
  next();
});

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
console.log('end app.set');

//ROUTES below will not be used until called upon

//RENDER ALL items with GET
let authorized = false;
app.get('/', (req, res) => {
  if (!authorized) {
    res.redirect('/login');
  }
  else {
    res.render('home');
  }
});

//RENDER LOGIN 
app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/logout', (req, res) => {
  authorized = false;
  res.render('login');
});

//AUTHORIZE with POST
app.post('/login', (req, res) => {
  const info = req.body;
  const user = Users_Inv.getUserByInfo(info.username, info.password);
  if (user == undefined) {
    res.redirect('/login');
  }
  else {
    authorized = true;
    res.render('home');
  }
});

app.use('/', productRoutes);
app.use('/', articleRoutes);
app.use('/', userRoutes);

//ERROR page
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/404.html')
});  

//SERVE PORT with LISTEN
app.listen(process.env.EXPRESS_CONTAINER_PORT, () => {
  console.log(`Server started on port: ${process.env.EXPRESS_CONTAINER_PORT}`)});
