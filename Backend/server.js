const express = require('express');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const crypto = require('crypto');
const path = require('path');
const cors = require('cors');

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoURI = "mongodb+srv://adityakannur:Aditya252004@cluster0.5zhqbdd.mongodb.net/FunniestAds_Database?retryWrites=true&w=majority";

const conn = mongoose.createConnection(mongoURI);

let gfs, gridFsBucket;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gridFsBucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
    gfs.collection('uploads');
});

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads',
                    metadata: {
                        originalname: file.originalname,
                        itemName: req.body.itemName,
                        amount: req.body.amount,
                        units: req.body.units,
                        boughtDate: req.body.boughtDate,
                        expiriyDate: req.body.expiriyDate,
                        guarantee: req.body.guarantee,
                        productLink: req.body.productLink,
                        blocks: JSON.parse(req.body.blocks)
                    }
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage });

app.post('/inventory', upload.array('images', 12), (req, res) => { 
    res.json({ files: req.files });
    console.log("Files uploaded with data:", req.body);
});

app.get('/inventory', async (req, res) => {
    try {
        const files = await gfs.files.find().toArray();
        if (!files || files.length === 0) {
            return res.status(404).send('No files found');
        }
        res.status(200).json(files);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
