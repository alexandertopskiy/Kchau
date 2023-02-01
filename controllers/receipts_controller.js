var Receipt = require('../models/receipt.js'),
    User = require('../models/user.js'),
    ReceiptController = {};

ReceiptController.index = function (req, res) {
    console.log('Вызван ReceiptController.index');
    var username = req.params.username || null,
        respondWithReceipt;
    respondWithReceipt = function (query) {
        Receipt.find(query, function (err, Receipts) {
            if (err !== null) {
                res.json(500, err);
            } else {
                res.status(200).json(Receipts);
            }
        });
    };
    if (username !== null) {
        console.log('Поиск пользователя: ' + username);
        User.find({ 'username': username }, function (err, result) {
            if (err !== null) {
                res.json(500, err);
            } else if (result.length === 0) {
                res.status(404).json({ 'result_length': 0 });
            } else {
                respondWithReceipt({ 'owner': result[0]._id });
            }
        });
    } else {
        respondWithReceipt({});
    }
};

ReceiptController.create = function (req, res) {
    console.log('Вызван ReceiptController.create');
    var username = req.params.username || null;
    var newReceipt = new Receipt({
        'description': req.body.description,
        'status': req.body.status
    });

    console.log('username: ' + username);

    User.find({ 'username': username }, function (err, result) {
        if (err) {
            res.send(500);
        } else {
            if (result.length === 0) {
                newReceipt.owner = null;
            } else {
                newReceipt.owner = result[0]._id;
            }
            newReceipt.save(function (err, result) {
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

ReceiptController.show = function (req, res) {
    console.log('Вызван ReceiptController.show');
    // это ID, который мы отправляем через URL
    var id = req.params.id;
    // находим элемент списка задач с соответствующим ID
    Receipt.find({ '_id': id }, function (err, Receipt) {
        if (err !== null) {
            // возвращаем внутреннюю серверную ошибку
            res.status(500).json(err);
        } else {
            if (Receipt.length > 0) {
                // возвращаем успех!
                res.status(200).json(Receipt[0]);
            } else {
                // мы не нашли элемент списка задач с этим ID!
                res.send(404);
            }
        }
    });
};

ReceiptController.destroy = function (req, res) {
    console.log('Вызван ReceiptController.destroy');
    var id = req.params.id;
    Receipt.deleteOne({ '_id': id }, function (err, Receipt) {
        if (err !== null) {
            res.status(500).json(err);
        } else {
            if (Receipt.n === 1 && Receipt.ok === 1 && Receipt.deletedCount === 1) {
                res.status(200).json(Receipt);
            } else {
                res.status(404).json({ 'status': 404 });
            }
        }
    });
};

ReceiptController.update = function (req, res) {
    console.log('Вызван ReceiptController.update');
    var id = req.params.id;
    var newDescription = { $set: { description: req.body.description, status: req.body.status } };
    // var newStatus = {$set: {status: req.body.status}};
    Receipt.updateOne({ '_id': id }, newDescription, function (err, Receipt) {
        if (err !== null) {
            res.status(500).json(err);
        } else {
            if (Receipt.n === 1 && Receipt.nModified === 1 && Receipt.ok === 1) {
                res.status(200).json(Receipt);
            } else {
                res.status(404).json({ 'status': 404 });
            }
        }
    });
};

module.exports = ReceiptController;
