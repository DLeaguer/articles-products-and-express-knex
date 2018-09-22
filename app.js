console.log('\nstart app.js');
console.log(`\n   connect require/assign`);
const express = require('express');
const exphbs = require('express-handlebars');
const bp = require('body-parser');
const methodOverride = require('method-override');

//Use app for all express methods
const app = express();

//Use db folder
console.log('\n   connect db cache');
const Users = require('./db/users.js');
const Users_Inv = new Users();
const knex = require('./knex/knex.js');

//Use routes folder
console.log('\n   connect routes');
const homeRoutes = require('./routes/home.js');
const productRoutes = require('./routes/product.js');
const articleRoutes = require('./routes/articles.js');
const userRoutes = require('./routes/users.js');

//middleware
console.log(`\n   connect middleware`);
app.use(express.static('public'));
app.use(bp.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use((req, res, next) => {
  console.log(`\n${req.method} request at: ${req.url}`);
  next();
});

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
console.log('   connected engine/set');

//Routes
app.use('/', homeRoutes);
app.use('/', productRoutes);
app.use('/', articleRoutes);
app.use('/', userRoutes);
console.log(`   connect routes middleware`);

//ERROR page
app.get('*', (req, res) => {
  res.render(__dirname + '/public/404.hbs')
});  

//SERVE PORT with LISTEN
app.listen(process.env.EXPRESS_CONTAINER_PORT, () => {
  console.log(`\nServer started on port: ${process.env.EXPRESS_CONTAINER_PORT}`)
  console.log(`\n`);
});

console.log('end app.js');