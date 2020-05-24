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

ToDosController.show = function (req, res) {
	// это ID, который мы отправляем через URL
	var id = req.params.id;
	// находим элемент списка задач с соответствующим ID 
	ToDo.find({"_id":id}, function (err, todo) {
		if (err !== null) {
			res.json(err);
		} else {
			if (todo.length > 0) {
				res.json(todo[0]);
			} else {
				res.send("Не найдено");
			}
		}
	});
};

module.exports = ToDosController;