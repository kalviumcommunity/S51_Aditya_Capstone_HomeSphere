const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const Item = require('./Modals/Item'); // Make sure the path is correct
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.post('/inventory', upload.single('image'), async (req, res) => {
    try {
        const blocks = JSON.parse(req.body.blocks);

        const newItem = new Item({
            name: req.body.itemName,
            amount: req.body.amount,
            units: req.body.units,
            date : {
                boughtDate: req.body.boughtDate,
                expiriyDate: req.body.expiriyDate,
                guarantee: req.body.guarantee,
            },
            image: req.body.image ? req.body.image : '', // Adjusted to check if file exists
            // gifted: req.body.gifted === 'true', // Convert to boolean
            productLink: req.body.productLink,
            blocks: blocks.map(block => ({
                units: block.units,
                location: block.location,
                specificity: block.specificity
            }))
        });

        await newItem.save();

        res.status(201).send({ message: 'success', data: newItem });
    } catch (err) {
        res.status(400).send({ message: 'error', error: err });
    }
});


mongoose.connect(process.env.DATA_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to DB');
        app.listen(port, function () {
            console.log(`Listening on http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.log('error connecting to DB', error);
    });
