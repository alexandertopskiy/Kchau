var ToDo = require("../models/todo.js"),
	User = require("../models/user.js"),
	ToDosController = {};

ToDosController.index = function (req, res) { 
	console.log("Вызван ToDosController.index");
	var username = req.params.username || null,
		respondWithToDos;
	respondWithToDos = function (query) { 
		ToDo.find(query, function (err, toDos) {
			if (err !== null) {
				res.json(500, err);
			} else {
				res.status(200).json(toDos);
			}
		});
	};
	if (username !== null) {
		console.log("Поиск пользователя: "+username);
		User.find({"username": username}, function (err, result) {
			if (err !== null) {
				res.json(500, err);
			} else if (result.length === 0) {
				res.status(404).json({"result_length": 0});
			} else {
				respondWithToDos({"owner": result[0]._id});
			}
		});
	} else {
		respondWithToDos({});
	}
};

ToDosController.create = function (req, res) {
	console.log("Вызван ToDosController.create");
	var username = req.params.username || null;
	var newToDo = new ToDo({
		"description": req.body.description,
		"tags": req.body.tags,
		"status" : req.body.status
	});

	console.log("username: " + username);

	User.find({"username": username}, function (err, result) {
		if (err) {
			res.send(500);
		} else {
			if (result.length === 0) {
				newToDo.owner = null;
			} else {
				newToDo.owner = result[0]._id;
			}
			newToDo.save(function (err, result) {
				console.log(result);
				if (err !== null) {
					// элемент не был сохранен!
					console.log(err);
					res.json(500, err);
				} else {
					res.status(200).json(result);
				}
			});
		}
	});
};

ToDosController.show = function (req, res) {
	console.log("Вызван ToDosController.show");
	// это ID, который мы отправляем через URL
	var id = req.params.id;
	// находим элемент списка задач с соответствующим ID 
	ToDo.find({"_id":id}, function (err, todo) {
		if (err !== null) {
			// возвращаем внутреннюю серверную ошибку 
			res.status(500).json(err);
		} else {
			if (todo.length > 0) {
				// возвращаем успех!
				res.status(200).json(todo[0]);
			} else {
				// мы не нашли элемент списка задач с этим ID! 
				res.send(404);
			}
		}
	});
};

ToDosController.destroy = function (req, res) {
	console.log("Вызван ToDosController.destroy");
	var id = req.params.id;
	ToDo.deleteOne({"_id": id}, function (err, todo) {
		if (err !== null) {
			res.status(500).json(err);
		} else {
			if (todo.n === 1 && todo.ok === 1 && todo.deletedCount === 1) {
				res.status(200).json(todo);
			} else {
				res.status(404).json({"status": 404});
			}
		}
	});
}

ToDosController.update = function (req, res) {
	console.log("Вызван ToDosController.update");
	var id = req.params.id;
	var newDescription = {$set: {description: req.body.description, status: req.body.status}};
	// var newStatus = {$set: {status: req.body.status}};
	ToDo.updateOne({"_id": id}, newDescription, function (err,todo) {
		if (err !== null) {
			res.status(500).json(err);
		} else {
			if (todo.n === 1 && todo.nModified === 1 && todo.ok === 1) {
				res.status(200).json(todo);
			} else {
				res.status(404).json({"status": 404});
			}
		}
	});

}

module.exports = ToDosController;