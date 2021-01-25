let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

let indexRouter = require('./routes/index');
let userRouter = require('./routes/users');

const { normalize } = require('path');

let app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
const PORT = 8080;

// const DBConfig = require('./.config_db.json')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// connect to DB
// console.log(`mongodb://${DBConfig.username}:${DBConfig.passwd}@localhost:27017/${DBConfig.db}`);
mongoose.connect(
  `mongodb://192.249.18.232:27017/totonono`, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false
}, () => { console.log('connected to DB') }
);



app.use('/', indexRouter);
app.use('/user', userRouter);

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

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`)
});

module.exports = app;