var Receipt = require('../models/receipt.js'),
    User = require('../models/user.js'),
    ReceiptController = {};

// Индексация (проверка существования) квитанции
ReceiptController.index = function (req, res) {
    console.log('\nВызван ReceiptController.index');
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

// Отобразить квитанцию
ReceiptController.show = function (req, res) {
    console.log('\nВызван ReceiptController.show');
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

// Создать новую квитанцию
ReceiptController.create = function (req, res) {
    console.log('\nВызван ReceiptController.create');
    var username = req.params.username || null;
    var newReceipt = new Receipt({
        'description': req.body.description,
        'status': req.body.status
    });
    console.log('username: ' + username);

    User.find({ 'username': username }, function (err, result) {
        if (err !== null) {
            console.log('error: ', err);
            res.status(500).send(err);
        } else {
            if (result.length === 0) newReceipt.owner = null;
            else newReceipt.owner = result[0]._id;

            newReceipt.save(function (err, result) {
                console.log(result);
                if (err !== null) {
                    // элемент не был сохранен!
                    console.log('error: ', err);
                    res.status(500).send(err);
                } else res.status(200).json(result);
            });
        }
    });
};

// Обновить существующую квитанцию
ReceiptController.update = function (req, res) {
    console.log('\nВызван ReceiptController.update');
    var id = req.params.id;
    var newDescription = { $set: { description: req.body.description, status: req.body.status } };
    // var newStatus = {$set: {status: req.body.status}};
    Receipt.updateOne({ '_id': id }, newDescription, function (err, receipt) {
        if (err !== null) {
            console.log('error: ', err);
            res.status(500).send(err);
        } else {
            if (receipt.acknowledged && receipt.modifiedCount === 1 && receipt.matchedCount === 1)
                res.status(200).json(receipt);
            else res.status(404).json({ 'status': 404 });
        }
    });
};

// Удалить существующую квитанцию
ReceiptController.destroy = function (req, res) {
    console.log('\nВызван ReceiptController.destroy');
    const id = req.params.id;
    Receipt.deleteOne({ '_id': id }, function (err, receipt) {
        if (err !== null) {
            res.status(500).json(err);
        } else {
            console.log(receipt);
            if (receipt.acknowledged && receipt.deletedCount === 1) {
                res.status(200).json(receipt);
            } else {
                res.status(404).json({ 'status': 404 });
            }
        }
    });
};

module.exports = ReceiptController;
