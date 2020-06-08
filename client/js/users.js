var main = function (UsersObjects) {
	"use strict";
	var $input = $("<input>").addClass("username"),
		$butRegister = $("<button>").text("Зарегистрироваться в системе"),
		$butLogin = $("<button>").text("Войти"),
		$butEdit = $("<button>").text(" Поменять номер"),
		$butDestroy = $("<button>").text("Удалить из системы");

	$butRegister.on("click", function() {
		var username = $input.val();

		var example = /^[АВЕКМНОРСТУХ]\d{3}(?<!000)[АВЕКМНОРСТУХ]{2}\d{2,3}$/ui;
		console.log(username);
		var check = example.test(username); // false
		console.log(check);


		if (check) {
			if (username !== null && username.trim() !== "") {
				var newUser = {"username": username};
				$.post("users", newUser, function(result) {
					console.log(result);
					// отправляем на клиент
					UsersObjects.push(newUser);
				}).done(function(responde) {
					console.log(responde);
					alert('Аккаунт успешно создан!');
					$butLogin.trigger("click");
				}).fail(function(jqXHR, textStatus, error) {
					console.log(error);
					if (jqXHR.status === 501) {
						alert("Такой пользователь уже существует!\nИзмените логин и повторите "
							+ "попытку");
					} else {					
						alert("Произошла ошибка!\n"+jqXHR.status + " " + jqXHR.textStatus);	
					}
				});
			}
		}
		else {
			alert('Введенные данные не соответствуют формату гос.номера РФ!\nПовторите ввод')
			$input.val("");
		}
	});

	$butLogin.on("click", function() {
		var username = $input.val();
		if (username !== null && username.trim() !== "") {
			var loginUser = {"username": username};
			$.ajax({
				'url': '/users/'+username,
				'type': 'GET'
			}).done(function(responde) {
				window.location.replace('users/' + username + '/');
			}).fail(function(jqXHR, textStatus, error) {
				console.log(error);
				alert("Произошла ошибка!\n"+jqXHR.status + " " + jqXHR.textStatus);	
			});
		}
	});

	$butEdit.on("click", function() {
		if ($input.val() !== "") {
			if ($input.val() !== null && $input.val().trim() !== "") {
				var username = $input.val();
				var newUsername = prompt("Введите новое имя пользователя", $input.val());
				if (newUsername !== null && newUsername.trim() !== "") {
					$.ajax({
						'url': '/users/'+username,
						'type': 'PUT',
						'data': { 'username': newUsername }
					}).done(function(responde) {
						console.log(responde);
						$input.val(newUsername);
						alert('Имя пользователя успешно изменено');
					}).fail(function(jqXHR, textStatus, error) {
						console.log(error);
						alert("Произошла ошибка!\n"+jqXHR.status + " " + jqXHR.textStatus);	
					});
				}
			}
		}
	});

	$butDestroy.on("click", function() {
		if ($input.val() !== "") {
			if ($input.val() !== null && $input.val().trim() !== "") {
				var username = $input.val();
				if (confirm("Вы уверены, что хотете удалить пользователя " + username + "?")) {
					$.ajax({
						'url': '/users/'+username,
						'type': 'DELETE',
					}).done(function(responde) {
						console.log(responde);
						$input.val("");
						alert('Пользователь успешно удален');
					}).fail(function(jqXHR, textStatus, error) {
						console.log(error);
						alert("Произошла ошибка!\n"+jqXHR.status + " " + jqXHR.textStatus);	
					});
				}
			}
		}
	});

	$("main .authorization").append($input);
	$("main .authorization").append($butDestroy);
	$("main .authorization").append($butEdit);
	$("main .authorization").append($butLogin);
	$("main .authorization").append($butRegister);

}

$(document).ready(function() {
	$.getJSON("users.json", function (UsersObjects) {
		main(UsersObjects);
	});
});