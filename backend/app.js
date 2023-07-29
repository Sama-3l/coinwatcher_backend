const express = require('express');
const cors = require('cors');
const body_parser = require('body-parser')
const route = require('./routes/routes')

const app = express()
app.use(body_parser.json())
app.use(cors());

app.use('/', route)

module.exports = app;