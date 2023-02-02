var User = require('../models/user.js'),
    ToDo = require('../models/receipt.js'),
    UsersController = {};

// Индексация (проверка существования) пользователя
UsersController.index = function (_, res) {
    console.log('\nВызвано действие: UsersController.index');
    User.find(function (err, users) {
        if (err !== null) {
            console.log('error: ', err);
            res.status(500).send(err);
        } else {
            res.status(200).json(users);
        }
    });
};

// Отобразить пользователя
UsersController.show = function (req, res) {
    console.log('\nВызвано действие: отобразить пользователя');

    User.find({ 'username': req.params.username }, function (err, result) {
        if (err !== null) {
            console.log('error: ', err);
            res.status(500).send(err);
        } else if (result.length !== 0) {
            res.sendFile('/client/list.html', { root: __dirname + '../../..' });
        } else {
            res.status(404).send('Пользователь не существует');
            console.log(err);
        }
    });
};

// Создать нового пользователя
UsersController.create = function (req, res) {
    console.log('\nВызвано действие: создать пользователя');
    var username = req.body.username;
    console.log('username: ', username);

    User.find({ 'username': username }, function (err, result) {
        if (err !== null) {
            console.log('error: ', err);
            res.status(500).send(err);
        } else if (result.length !== 0) {
            console.log('Пользователь уже существует');
            res.status(501).send('Пользователь уже существует');
        } else {
            var newUser = new User({
                'username': username
            });
            newUser.save(function (err, result) {
                console.log('error: ', err);
                if (err !== null) {
                    console.log(`error: `, err);
                    res.status(500).json(err);
                } else {
                    console.log(`result: `, result);
                    res.status(200).json(result);
                }
            });
        }
    });
};

// Обновить существующего пользователя
UsersController.update = function (req, res) {
    console.log('\nВызвано действие: обновить пользователя');
    var username = req.params.username;
    console.log('Старое имя пользователя: ' + username);
    var newUsername = { $set: { username: req.body.username } };
    console.log('Новое имя пользователя: ' + req.body.username);

    User.find({ 'username': req.body.username }, function (err, result) {
        if (err !== null) {
            console.log('error: ', err);
            res.status(500).send(err);
        } else if (result.length !== 0) {
            console.log('Такой пользователь уже существует');
            res.status(501).send('Такой пользователь уже существует');
        } else {
            console.log('обновляем');
            User.updateOne({ 'username': username }, newUsername, function (err, user) {
                if (err !== null) {
                    console.log(`error: `, err);
                    res.status(500).json(err);
                } else {
                    console.log(user);
                    if (user.matchedCount === 1 && user.modifiedCount === 1 && user.acknowledged) {
                        console.log('Номер изменен');
                        res.status(200).json(user);
                    } else {
                        console.log(err);
                        res.status(404).send('Такого пользователя не существует');
                    }
                }
            });
        }
    });
};

// Удалить существующего пользователя
UsersController.destroy = function (req, res) {
    console.log('\nВызвано действие: удалить пользователя');
    var username = req.params.username;

    User.find({ 'username': username }, function (err, result) {
        if (err !== null) {
            console.log('error: ', err);
            res.status(500).send(err);
        } else if (result.length !== 0) {
            // console.log("Удаляем все todo с 'owner': " + result[0]._id);
            // ToDo.deleteMany({ 'owner': result[0]._id }, function (err, todo) {});
            console.log('Удаляем пользователя');
            User.deleteOne({ 'username': username }, function (err, user) {
                if (err !== null) {
                    res.status(500).json(err);
                } else {
                    res.status(200).json(user);
                }
            });
        } else {
            console.log('Пользователь не существует');
            res.status(404).send('Пользователь не существует');
        }
    });
};

module.exports = UsersController;
