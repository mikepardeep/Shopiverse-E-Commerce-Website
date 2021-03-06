//File for website main functionalities


//import package 
const express = require ('express');
const path = require('path');
const csrf = require('csurf');
const expressSession = require('express-session');


//import the files location
    //import the config sessions
const createSessionConfig = require('./config/session');
    //import the database 
const db = require('./data/database')
    //import the csrf middlewares
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
    //import error handling middleware
const errorHandlerMiddleware = require('./middlewares/error-handler');
    //import check auth status middlewares
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
//import cart middleware
const cartMiddleware = require('./middlewares/cart');
//import updatePrice middleware
const updateCartPriceMiddleware = require('./middlewares/update-cart-prices');

//import not found middleware
const notFoundMiddleware = require('./middlewares/not-found')

//import the routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');
const adminRoutes = require('./routes/admin.routes');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/orders.routes');


//initalize the express
const app = express();


//set the options for ejs
app.set('view engine', 'ejs');
    //location of the views folder
app.set("views", path.join(__dirname, 'views'));

//static file for public and product-data folder
app.use(express.static('public'));
app.use('/products/assets' , express.static('product-data'));

//to parses incoming request based on body-parser (ejs form) req.body
app.use(express.urlencoded({extended: false}));

//incoming request for json data
app.use(express.json());

//express session on incoming request
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

//security csrf token on incoming request
app.use(csrf());


//use the security csrf middleware on incoming request
app.use(addCsrfTokenMiddleware);

//use the checkAuth status Middleware on incoming request
app.use(checkAuthStatusMiddleware);

//cart middleware on incoming request
app.use(cartMiddleware);
app.use(updateCartPriceMiddleware);



//add a middleware for incoming request from routes
app.use(baseRoutes);
app.use(authRoutes);
app.use(productRoutes);

//set the prefix for cart routes.
app.use('/cart',cartRoutes)

//run protect route middleware
app.use('/orders', protectRoutesMiddleware, orderRoutes);
app.use('/admin', protectRoutesMiddleware, adminRoutes);

//not found
app.use(notFoundMiddleware);


//error handling middleware for incoming request
app.use(errorHandlerMiddleware);


//listen to the port only if connection made to the database.
db.connectToDatabase().then(function(){

    //listen to the port
    app.listen(3000);
}).catch(function(error){

    console.log('failed to connect to the database')
    console.log(error);
});

