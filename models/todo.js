var mongoose = require("mongoose");
// Это модель mongoose для списка задач
var ToDoSchema = mongoose.Schema({
	description: String,
	tags: [ String ]
});

var ToDo = mongoose.model("ToDo", ToDoSchema); 
module.exports = ToDo;