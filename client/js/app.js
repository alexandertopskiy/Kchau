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

    // Вкладка "Добавить"
    tabs.push({
        'name': 'Добавить',
        'content': function () {
            $.get('Receipts.json', () => {
                const $inputTitle = $('<h3>').text('Введите новерок на стоянке: ');
                const $input = $('<input>').addClass('description');

                const $checboxWrapper = $('<div>').addClass('checkbox-wrapper');
                const $checkboxTitle = $('<p>').text('Уже оплачено?');
                const $checkbox = $('<input type="checkbox">');

                const $button = $('<button>').text('Добавить');
                const $content = $('<ul>');

                $content.append($input);

                $checboxWrapper.append($checkbox);
                $checboxWrapper.append($checkboxTitle);

                [$inputTitle, $content, $checboxWrapper, $button].forEach(el => $('main .content').append(el));

                function btnCallback() {
                    const checkTime = num => (num < 10 ? '0' + num : num);
                    const nowDate = new Date();
                    const year = nowDate.getFullYear();
                    const month = checkTime(nowDate.getMonth());
                    const day = checkTime(nowDate.getDate());
                    const hour = checkTime(nowDate.getHours());
                    const minutes = checkTime(nowDate.getMinutes());

                    const fullDate = day + '.' + month + '.' + year + ' ' + hour + ':' + minutes;
                    const description = '№' + $input.val() + ' (' + fullDate + ') ';

                    const isPaid = $checkbox.is(':checked');
                    const status = isPaid ? 'Оплачено' : 'Не оплачено';

                    const newReceipt = { 'description': description, 'status': status };

                    $.post('Receipts', newReceipt, () => $('.tabs a:first-child span').trigger('click'));
                }

                $button.on('click', () => btnCallback());
                // обработка нажатия "enter"
                $input.on('keydown', e => {
                    if (e.which === 13) btnCallback();
                });
            });
        }
    });

    // Вкладка "Выйти"
    tabs.push({
        'name': 'Выйти',
        'content': function () {
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
