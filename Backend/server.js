const express = require('express');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const crypto = require('crypto');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoURI = process.env.DATA_URI

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

                // Ensure blocks is valid JSON
                let blocks = [];
                try {
                    blocks = req.body.blocks ? JSON.parse(req.body.blocks) : [];
                } catch (parseErr) {
                    console.error("Error parsing blocks:", parseErr);
                    return reject(parseErr); // If parsing fails, reject the promise
                }

                const fileInfo = {
                    filename: filename,
                    bucketName: 'final',
                    metadata: {
                        uniqueIdentifier: req.body.uniqueIdentifier,
                        originalname: file.originalname,
                        itemName: req.body.itemName,
                        amount: req.body.amount,
                        units: req.body.units,
                        boughtDate: req.body.boughtDate,
                        expiriyDate: req.body.expiriyDate,
                        guarantee: req.body.guarantee,
                        productLink: req.body.productLink,
                        blocks: blocks, // Properly parsed blocks
                    }
                };
                resolve(fileInfo);
            });
        });
    }
});


const upload = multer({ storage });

// File upload endpoint for multiple images
app.post('/upload', upload.array('images', 10), (req, res) => {
    console.log(req.body);
    console.log(req.files); 
    res.json({ files: req.files });
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
            //reading the file data and downloading it to display in frontend
            const readStream = gridFsBucket.openDownloadStreamByName(file.filename);
            res.set('Content-Type', file.contentType);
            // piping it
            readStream.pipe(res);
        } else {
            return res.status(404).json({ err: 'Not an image' });
        }           
    } catch (err) {
        console.error('Error finding file:', err);
        res.status(500).json({ err: 'Server error' });
    }
});

// Delete a specific image by filename
app.delete('/delete/:filename', async (req, res) => {
    try {
        const { filename } = req.params;

        const file = await gfs.files.findOne({ filename });
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        // Delete file from GridFS
        await gridFsBucket.delete(file._id);

        res.json({ message: "Image deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while deleting image" });
    }
});

// Update item metadata and add new images
app.put('/update/:id', upload.array('images', 10), async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ObjectId format" });
        }

        // Find the existing file
        const file = await gfs.files.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        // Merge new images if uploaded
        const newImages = req.files.map((file) => file.filename);
        const updatedMetadata = {
            ...file.metadata,
            ...updatedData,
            filenames: [...(file.metadata?.filenames || []), ...newImages],
        };

        // Update metadata
        const result = await gfs.files.updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: { metadata: updatedMetadata } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Item not updated" });
        }

        res.json({ message: "Item updated successfully", updatedMetadata });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while updating item" });
    }
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

