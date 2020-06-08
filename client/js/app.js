var organizeByTags = function (toDoObjects) { 
	// создание пустого массива для тегов
	var tags = [];
	// перебираем все задачи toDos 
	toDoObjects.forEach(function (toDo) {
		// перебираем все теги для каждой задачи 
		toDo.tags.forEach(function (tag) {
			// убеждаемся, что этого тега еще нет в массиве
			if (tags.indexOf(tag) === -1) { 
				tags.push(tag);
			}
		});
	}); 
	var tagObjects = tags.map(function (tag) {
		// здесь мы находим все задачи,
		// содержащие этот тег
		var toDosWithTag = []; 
		toDoObjects.forEach(function (toDo) {
			// проверка, что результат
			// indexOf is *не* равен -1
			if (toDo.tags.indexOf(tag) !== -1) { 
				toDosWithTag.push(toDo.description);
			}
		});
		// мы связываем каждый тег с объектом, который содержит название тега и массив
		return { "name": tag, "toDos": toDosWithTag };
	});
	return tagObjects;
};

var liaWithEditOrDeleteOnClick = function (todo, callback) {
	var $todoListItem = $("<li>").text(todo.description),
		$todoEditLink = $("<a>").attr("href", "todos/" + todo._id),
		$todoRemoveLink = $("<a>").attr("href", "todos/" + todo._id);

	$todoEditLink.addClass("linkEdit");
	$todoRemoveLink.addClass("linkRemove");



	if (todo.status === 'Не оплачено') {
		$todoEditLink.text("Оплатить");
		$todoEditLink.on("click", function() {

			// var newDescription = prompt("Введите новое наименование для задачи", todo.description);
			var newDescription = todo.description + "[Оплачено]";

			if (newDescription !== null && newDescription.trim() !== "") {
				$.ajax({
					"url": "/todos/" + todo._id,
					"type": "PUT",
					"data": { "description": newDescription },
				}).done(function (responde) {
					todo.status = 'Оплачено';
					callback();
				}).fail(function (err) {
					console.log("Произошла ошибка: " + err);
				});
			}
			// $todoEditLink.text(" ");

			return false;
		});	
		$todoListItem.append($todoEditLink);
	}
	else {
		$todoRemoveLink.text("Удалить");
		$todoRemoveLink.on("click", function () {
			$.ajax({
				url: "/todos/" + todo._id,
				type: "DELETE"
			}).done(function (responde) {
				callback();
			}).fail(function (err) {
				console.log("error on delete 'todo'!");
			});
			return false;
		});
		$todoListItem.append($todoRemoveLink);
	}

	return $todoListItem;
}

var main = function (toDoObjects) {
	"use strict";
	// создание пустого массива с вкладками
	var tabs = [];
	// добавляем вкладку Новые
	tabs.push({
		"name": "Мои квитанции",
		// создаем функцию content
		// так, что она принимает обратный вызов
		"content": function(callback) {
			$.getJSON("todos.json", function (toDoObjects) {
				var $content = $("<ul>");
				for (var i = toDoObjects.length-1; i>=0; i--) {
					var $todoListItem = liaWithEditOrDeleteOnClick(toDoObjects[i], function() {
						$(".tabs a:first-child span").trigger("click");
					});
					$content.append($todoListItem);
				}
				callback(null, $content);
			}).fail(function (jqXHR, textStatus, error) {
				callback(error, null);
			});
		}
	});

	// добавляем вкладку Неоплаченные
	tabs.push({
		"name": "Неоплаченные",
		"content": function(callback) {
			$.getJSON("todos.json", function (toDoObjects) {
				var $content, i;
				$content = $("<ul>");
				for (i = 0; i < toDoObjects.length; i++) {
					if (toDoObjects[i].status === 'Не оплачено') {
						var $todoListItem = liaWithEditOrDeleteOnClick(toDoObjects[i], function() {
							$(".tabs a:nth-child(2) span").trigger("click");
						});
						$content.append($todoListItem);
					}
				}
				callback(null, $content);
			}).fail(function(jqXHR, textStatus, error) {
				callback(error, null);
			});
		}
	});

	// создаем вкладку Добавить
	tabs.push({

		"name": "Добавить",
		"content":function () {
			$.get("todos.json", function (toDoObjects) {	
				// создание $content для Добавить 
				var $place = $("<h3>").text("Введите новерок на стоянке: "),
					$input = $("<input>").addClass("description"), 
					$button = $("<button>").text("Добавить"),
					$content1 = $("<ul>");

				$content1.append($input);
				$("main .content").append($place);
				$("main .content").append($content1);
				$("main .content").append($button); 
				
				function btnfunc() {

					function checkTime(i) {
						if (i<10) {
							i="0" + i;
						}
						return i;
					}
					var Data = new Date(),
						Year = Data.getFullYear(), Month = Data.getMonth(), Day = Data.getDate(),
						Hour = checkTime(Data.getHours()), Minutes = checkTime(Data.getMinutes());

					var data = (Day+"."+Month+"."+Year+" "+Hour+":"+Minutes);
					// Вывод
					console.log(data);

					var description = ('№' + $input.val() + ' (' + data + ') '),
						// создаем новый элемент списка задач
						newToDo = {"description":description, "status": 'Не оплачено'};
					

					$.post("todos", newToDo, function(result) {
						$input.val("");
						$(".tabs a:first-child span").trigger("click");
					});
				}
				$button.on("click", function() {
					btnfunc();
				});
				$('.tags').on('keydown',function(e){
					if (e.which === 13) {
						btnfunc();
					}
				});
			});
		}
	});

	tabs.forEach(function (tab) {
		var $aElement = $("<a>").attr("href",""),
			$spanElement = $("<span>").text(tab.name);
		$aElement.append($spanElement);
		$("main .tabs").append($aElement);

		$spanElement.on("click", function () {
			var $content;
			$(".tabs a span").removeClass("active");
			$spanElement.addClass("active");
			$("main .content").empty();
			tab.content(function (err, $content) {
				if (err !== null) {
					alert ("Возникла проблема при обработке запроса: " + err);
				} else {
					$("main .content").append($content);
				}
			});
			return false;
		});
	});

	$(".tabs a:first-child span").trigger("click");
}

$(document).ready(function() {
	$.getJSON("todos.json", function (toDoObjects) {
		main(toDoObjects);
	});
});
