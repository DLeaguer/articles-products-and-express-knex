const express = require('express');
const exphbs = require('express-handlebars');
const bp = require('body-parser');
const methodOverride = require('method-override');
console.log(`\nconnected required`);

//Use app for all express methods
const app = express();
console.log('\nassigned express() to app');

//Use db folder
const Users = require('./db/users.js');
const Users_Inv = new Users();
const knex = require('./knex/knex.js');
console.log('\nconnected db folders');

//Use routes folder
const homeRoutes = require('./routes/home.js');
const productRoutes = require('./routes/product.js');
const articleRoutes = require('./routes/articles.js');
const userRoutes = require('./routes/users.js');
console.log('\nconnected routes folder');

//middleware
app.use(express.static('public'));
app.use(bp.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use((req, res, next) => {
  console.log(`\n${req.method} request at: ${req.url}`);
  next();
});
console.log(`connected middleware`);

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
console.log('connected engine/set');

//Routes
app.use('/', homeRoutes);
app.use('/', productRoutes);
app.use('/', articleRoutes);
app.use('/', userRoutes);
console.log(`connected middleware routes`);

//ERROR page
app.get('*', (req, res) => {
  res.render(__dirname + '/public/404.hbs')
});  

//SERVE PORT with LISTEN
app.listen(process.env.EXPRESS_CONTAINER_PORT, () => {
  console.log(`\nServer started on port: ${process.env.EXPRESS_CONTAINER_PORT}`)
  console.log(`\n`);
});
