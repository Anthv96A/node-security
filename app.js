const express = require('express');
const app = express();
const db = require('./db');

const UserController = require('./user/UserController');
const AuthController = require('./auth/AuthController');

app.use('/users', UserController);
app.use('/auth', AuthController);

module.exports = app;