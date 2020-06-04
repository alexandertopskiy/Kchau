// обратите внимание на то, что нужно перейти в папку, 
// в которой находится каталог models
var User = require("../models/user.js"), 
	Users ontroller = {},
	mongoose = require("mongoose");
 
// проверка, не существует ли уже пользователь 
User.find({}, function (err, result) {
	if (err !== null) {
		console.log("Что-то идет не так"); 
		console.log(err);
	} else if (result.length === 0) {
		console.log("Создание тестового пользователя..."); 
		var exampleUser = new User({"username":"usertest"}); 
		exampleUser.save(function (err, result) {
			if (err) {
				console.log(err);
			} else {
				console.log("Тестовый пользователь сохранен");
			}
		});
	}
});

UsersController.index = function (req, res) { 
	console.log("вызвано действие: индекс"); 
	res.send(200);
};

// Отобразить пользователя 
UsersController.show = function (req, res) { 
	console.log("вызвано действие: показать"); 
	res.send(200);
};

// Создать нового пользователя 
UsersController.create = function (req, res) { 
	console.log("вызвано действие: создать"); 
	res.send(200);
};

// Обновить существующего пользователя 
UsersController.update = function (req, res) { 
	console.log("вызвано действие: обновить"); 
	res.send(200);
};

// Удалить существующего пользователя 
UsersController.destroy = function (req, res) { 
	console.log("destroy action called"); 
	res.send(200);
};

module.exports = Users ontroller;