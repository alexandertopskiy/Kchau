var express = require("express"),
	http = require("http"),
	mongoose = require("mongoose"),
	// импорт представления ToDoController
	ToDosController = require("./controllers/todos_controller.js"),
	app = express(); 

// Это модель Mongoose для задач
var ToDoSchema = mongoose.Schema({
	description: String,
	tags: [ String ]
});
// var ToDo = mongoose.model("ToDo", ToDoSchema);
http.createServer(app).listen(3000);

app.use(express.static(__dirname + "/client"));

app.get("/todos.json", ToDosController.index);
// базовые маршруты CRUD 
app.get("/todos/:id", ToDosController.show); 
app.post("/todos", ToDosController.create);

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



