const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileMetadataSchema = new Schema({
    filename: { type: String, required: true },
    originalname: { type: String, required: true },
    itemName: { type: String, required: true },
    amount: { type: Number, required: true },
    units: { type: String, required: true },
    boughtDate: { type: Date, required: true },
    expiriyDate: { type: Date, required: true },
    guarantee: { type: String, required: true },
    productLink: { type: String, required: true },
    blocks: { type: Array, required: true },
    gridfsId: { type: mongoose.Types.ObjectId, required: true }
});

module.exports = mongoose.model('FileMetadata', fileMetadataSchema);
