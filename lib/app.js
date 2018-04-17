const express = require('express');
const app = express();
const pokemons = require('./routes/pokemons');

app.use(express.json());

app.use('/pokemons', pokemons);

module.exports = app;