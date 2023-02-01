var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId;

var ReceiptSchema = mongoose.Schema({
    description: String,
    status: String,
    owner: { type: ObjectId, ref: 'User' }
});

var Receipt = mongoose.model('Receipt', ReceiptSchema);

module.exports = Receipt;
