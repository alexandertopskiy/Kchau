var liaWithEditOrDeleteOnClick = function (Receipt, callback) {
    var $ReceiptListItem = $('<li>').text(Receipt.description),
        $ReceiptEditLink = $('<a>').attr('href', 'Receipts/' + Receipt._id),
        $ReceiptRemoveLink = $('<a>').attr('href', 'Receipts/' + Receipt._id);

    $ReceiptEditLink.addClass('linkEdit');
    $ReceiptRemoveLink.addClass('linkRemove');

    if (Receipt.status === 'Не оплачено') {
        $ReceiptEditLink.text('Оплатить');
        $ReceiptEditLink.on('click', function () {
            var newDescription = Receipt.description + '[Оплачено]';

            if (newDescription !== null && newDescription.trim() !== '') {
                $.ajax({
                    'url': '/Receipts/' + Receipt._id,
                    'type': 'PUT',
                    'data': { 'description': newDescription }
                })
                    .done(function (responde) {
                        Receipt.status = 'Оплачено';
                        callback();
                    })
                    .fail(function (err) {
                        console.log('Произошла ошибка: ' + err);
                    });
            }

            return false;
        });
        $ReceiptListItem.append($ReceiptEditLink);
    } else {
        $ReceiptRemoveLink.text('Удалить');
        $ReceiptRemoveLink.on('click', function () {
            $.ajax({
                url: '/Receipts/' + Receipt._id,
                type: 'DELETE'
            })
                .done(function (responde) {
                    callback();
                })
                .fail(function (err) {
                    console.log("error on delete 'Receipt'!");
                });
            return false;
        });
        $ReceiptListItem.append($ReceiptRemoveLink);
    }

    return $ReceiptListItem;
};

var main = function (ReceiptObjects) {
    'use strict';
    // создание пустого массива с вкладками
    var tabs = [];
    // добавляем вкладку Новые
    tabs.push({
        'name': 'Мои квитанции',
        // создаем функцию content
        // так, что она принимает обратный вызов
        'content': function (callback) {
            $.getJSON('Receipts.json', function (ReceiptObjects) {
                var $content = $('<ul>');
                for (var i = ReceiptObjects.length - 1; i >= 0; i--) {
                    var $ReceiptListItem = liaWithEditOrDeleteOnClick(ReceiptObjects[i], function () {
                        $('.tabs a:first-child span').trigger('click');
                    });
                    $content.append($ReceiptListItem);
                }
                callback(null, $content);
            }).fail(function (jqXHR, textStatus, error) {
                callback(error, null);
            });
        }
    });

    // добавляем вкладку Неоплаченные
    tabs.push({
        'name': 'Неоплаченные',
        'content': function (callback) {
            $.getJSON('Receipts.json', function (ReceiptObjects) {
                var $content, i;
                $content = $('<ul>');
                for (i = 0; i < ReceiptObjects.length; i++) {
                    if (ReceiptObjects[i].status === 'Не оплачено') {
                        var $ReceiptListItem = liaWithEditOrDeleteOnClick(ReceiptObjects[i], function () {
                            $('.tabs a:nth-child(2) span').trigger('click');
                        });
                        $content.append($ReceiptListItem);
                    }
                }
                callback(null, $content);
            }).fail(function (jqXHR, textStatus, error) {
                callback(error, null);
            });
        }
    });

    // создаем вкладку Добавить
    tabs.push({
        'name': 'Добавить',
        'content': function () {
            $.get('Receipts.json', function (ReceiptObjects) {
                // создание $content для Добавить
                var $place = $('<h3>').text('Введите новерок на стоянке: '),
                    $input = $('<input>').addClass('description'),
                    $button = $('<button>').text('Добавить'),
                    $content1 = $('<ul>');

                $content1.append($input);
                $('main .content').append($place);
                $('main .content').append($content1);
                $('main .content').append($button);

                function btnfunc() {
                    function checkTime(i) {
                        if (i < 10) {
                            i = '0' + i;
                        }
                        return i;
                    }
                    var Data = new Date(),
                        Year = Data.getFullYear(),
                        Month = checkTime(Data.getMonth()),
                        Day = checkTime(Data.getDate()),
                        Hour = checkTime(Data.getHours()),
                        Minutes = checkTime(Data.getMinutes());

                    var data = Day + '.' + Month + '.' + Year + ' ' + Hour + ':' + Minutes;
                    // Вывод
                    console.log(data);

                    var description = '№' + $input.val() + ' (' + data + ') ',
                        // создаем новый элемент списка задач
                        newReceipt = { 'description': description, 'status': 'Не оплачено' };

                    $.post('Receipts', newReceipt, function (result) {
                        $input.val('');
                        $('.tabs a:first-child span').trigger('click');
                    });
                }
                $button.on('click', function () {
                    btnfunc();
                });
                $input.on('keydown', function (e) {
                    if (e.which === 13) {
                        btnfunc();
                    }
                });
            });
        }
    });

    tabs.push({
        'name': 'Выйти',
        'content': function () {
            // $(".title").trigger("click");
            document.location.href = '/index.html';
        }
    });

    tabs.forEach(function (tab) {
        var $aElement = $('<a>').attr('href', ''),
            $spanElement = $('<span>').text(tab.name);
        $aElement.append($spanElement);
        $('main .tabs').append($aElement);

        $spanElement.on('click', function () {
            var $content;
            $('.tabs a span').removeClass('active');
            $spanElement.addClass('active');
            $('main .content').empty();
            tab.content(function (err, $content) {
                if (err !== null) {
                    alert('Возникла проблема при обработке запроса: ' + err);
                } else {
                    $('main .content').append($content);
                }
            });
            return false;
        });
    });

    $('.tabs a:first-child span').trigger('click');
};

$(document).ready(function () {
    $.getJSON('Receipts.json', function (ReceiptObjects) {
        main(ReceiptObjects);
    });
});
