var mongoose = require("mongoose"),
	ObjectId = mongoose.Schema.Types.ObjectId;
	
// Это модель mongoose для списка задач
var ReceiptSchema = mongoose.Schema({
	description: String,
	status : String,
	owner : { type: ObjectId, ref: "User" }
});

var Receipt = mongoose.model("Receipt", ReceiptSchema); 
module.exports = Receipt;