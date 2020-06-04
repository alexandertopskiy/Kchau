var mongoose = require("mongoose"),
	ObjectId = mongoose.Schema.Types.ObjectId;
	
// Это модель mongoose для списка задач
var ToDoSchema = mongoose.Schema({
	description: String,
	tags: [ String ],
	owner : { type: ObjectId, ref: "User" }
});

var ToDo = mongoose.model("ToDo", ToDoSchema); 
module.exports = ToDo;