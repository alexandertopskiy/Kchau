// var mongoose = require("mongoose");
// // Это модель Mongoose для пользователей
// var UserSchema = mongoose.Schema({
// 	username: String,
// 	id: String
// });
// var User = mongoose.model("User", UserSchema); 
// module.exports = User;

var main = function (UsersObjects) {
	"use strict";
	var $input = $("<input>").addClass("username"),
		$butRegister = $("<button>").text("Зарегистрироваться"),
		$butLogin = $("<button>").text("Войти");
	$butRegister.on("click", function() {
		var username = $input.val();
		if (username !== null) {
			var newUser = {"username": username};
			$.post("users", newUser, function(result) {
				console.log(result);
				// отправляем на клиент
				UsersObjects.push(newUser);
			}).done(function(responde) {
				alert('Аккаунт успешно создан!\nНажмите "Войти", чтобы продолжить')
			}).fail(function(jqXHR, textStatus, error) {
				console.log(error);
				alert('Произошла ошибка!\n'+error);
			});
		}
	});
	$butLogin.on("click", function() {
		var username = $input.val();
		if (username !== null) {
			var loginUser = {"username": username};
			$.ajax({
				'url': '/users/'+username,
				'type': 'GET'
			}).done(function(responde) {
				document.location.href = "/users/"+username;
			}).fail(function(jqXHR, textStatus, error) {
				console.log(error);
				alert("Произошла ошибка!\n"+error);
			});
		}
	})
}

$(document).ready(function() {
	$.getJSON("users.json", function (UsersObjects) {
		main();
	});
}); 