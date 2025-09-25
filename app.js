const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { default: mongoose } = require('mongoose');
const usersModel = require('./model/UsersModel');
const ProdModel = require('./model/ProdModel');
const { AuthService } = require('./service/AuthService');
const { ProdService } = require('./service/ProdService');


const url = 'mongodb+srv://david200024:182101.Hdav@cluster0.bywdqev.mongodb.net/usersDB?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(url)
  .then(() => console.log('DB is connected'))
  .catch(err => console.log(err))

const indexRouter = require('./routes/index');
const prodRouter = require('./routes/products');


const app = express();

app.locals.models = {
  users: usersModel,
  products: ProdModel
}

app.locals.services = {
  users: new AuthService(app.locals.models),
  products: new ProdService(app.locals.models)
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/', indexRouter);
app.use('/products', prodRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
