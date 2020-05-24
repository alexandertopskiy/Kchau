// обратите внимание на то, что нужно перейти в папку, 
// в которой находится каталог models
var ToDo = require("../models/todo.js"),
	ToDosController = {};

ToDosController.index = function (req, res) { 
	ToDo.find({}, function (err, toDos) { 
		res.json(toDos);
	});
};

ToDosController.create = function (req, res) {
	var newToDo = new ToDo({
		"description":req.body.description, 
		"tags":req.body.tags
	});
	newToDo.save(function (err, result) {
		console.log(result);
		if (err !== null) {
			// элемент не был сохранен!
			console.log(err);
			res.json(500, err);
		} else {
			res.json(200, result);
		}
	});
};

module.exports = ToDosController;