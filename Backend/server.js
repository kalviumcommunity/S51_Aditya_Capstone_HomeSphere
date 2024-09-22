const express = require('express');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const crypto = require('crypto');
const path = require('path');
const cors = require('cors');

const port = 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoURI = "mongodb+srv://adityakannur:Aditya252004@cluster0.5zhqbdd.mongodb.net/Capstone_Database?retryWrites=true&w=majority";

// Create MongoDB connection
const conn = mongoose.createConnection(mongoURI);

// Initialize GridFS
let gfs, gridFsBucket;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gridFsBucket = new GridFSBucket(conn.db, { bucketName: 'final' });
    gfs.collection('final');
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
                    bucketName: 'final',
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


// File upload endpoint
app.post('/upload', upload.single('images'), (req, res) => {
    console.log(req.body); // Log the body to see if the metadata is coming through
    console.log(req.file); // Log the file object
    res.json({ file: req.file });
});


// Fetch all inventory files
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

// Serve image files
app.get('/image/:filename', async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });

        if (!file || file.length === 0) {
            return res.status(404).json({ err: 'No file exists' });
        }

        // Check if the file is an image
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            const readStream = gridFsBucket.openDownloadStreamByName(file.filename);
            res.set('Content-Type', file.contentType);
            readStream.pipe(res);
        } else {
            return res.status(404).json({ err: 'Not an image' });
        }
    } catch (err) {
        console.error('Error finding file:', err);
        res.status(500).json({ err: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
