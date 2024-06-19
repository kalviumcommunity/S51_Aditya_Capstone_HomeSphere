const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send("you are looking into blank page")
})

app.listen(port, () => {
    console.log(`listening on ${port}`)
})