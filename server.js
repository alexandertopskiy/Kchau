var express = require("express"),
	http = require("http"),
	mongoose = require("mongoose"),
	app = express(); /*,
	toDos = [
		// настраиваем список задач копированием
		// содержимого из файла todos.OLD.json
	];*/
	// импортируем библиотеку mongoose
app.use(express.static(__dirname + "/client"));
// Это модель Mongoose для задач
var ToDoSchema = mongoose.Schema({
	description: String,
	tags: [ String ]
});
var ToDo = mongoose.model("ToDo", ToDoSchema);
http.createServer(app).listen(3000);
// Этот маршрут замещает наш файл
// todos.json в примере из части 5
app.get("/todos.json", function (req, res) {
	ToDo.find({}, function (err, toDos) {
		// не забудьте о проверке на ошибки
		res.json(toDos);
	});
});
// командуем Express принять поступающие
// объекты JSON
app.use(express.urlencoded({ extended: true }));
// подключаемся к хранилищу данных Amazeriffic в Mongo
mongoose.connect('mongodb://localhost/amazeriffic', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true 
	}).then(res => {
		console.log("DB Connected!")
	}).catch(err => {
		console.log(Error, err.message);
	});
app.post("/todos", function (req, res) {
	console.log(req.body);
	var newToDo = new ToDo({"description":req.body.description,
		"tags":req.body.tags});
	newToDo.save(function (err, result) {
		if (err !== null) {
			console.log(err);
			res.send("ERROR");
		} else {
			// клиент ожидает, что будут возвращены все задачи,
			// поэтому для сохранения совместимости сделаем дополнительный запрос
			ToDo.find({}, function (err, result) {
				if (err !== null) {
					// элемент не был сохранен
					res.send("ERROR");
				}
				res.json(result);
			});
		}
	});
});