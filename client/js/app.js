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
                    'data': { 'description': newDescription, 'status': 'Оплачено' }
                })
                    .done(() => {
                        Receipt.status = 'Оплачено';
                        alert('Квитанция успешно оплачена');
                        callback();
                    })
                    .fail(jqXHR => {
                        if (jqXHR.status === 404) alert('Такой квитанции не существует!');
                        else alert('Произошла ошибка! Повторите попытку позже!');
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
                .done(() => {
                    callback();
                    alert('Квитанция успешно удалена');
                })
                .fail(jqXHR => {
                    if (jqXHR.status === 404) alert('Такой квитанции не существует!');
                    else alert('Произошла ошибка! Повторите попытку позже!');
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

    // Вкладка "Новые"
    tabs.push({
        'name': 'Мои квитанции',
        'content': function (callback) {
            $.getJSON('Receipts.json', function (ReceiptObjects) {
                var $content = $('<ul>');
                for (var i = ReceiptObjects.length - 1; i >= 0; i--) {
                    const clickCallback = () => $('.tabs a:first-child span').trigger('click');
                    const $ReceiptListItem = liaWithEditOrDeleteOnClick(ReceiptObjects[i], clickCallback);
                    $content.append($ReceiptListItem);
                }
                callback(null, $content);
            }).fail(jqXHR => callback(jqXHR.status, null));
        }
    });

    // Вкладка "Неоплаченные"
    tabs.push({
        'name': 'Неоплаченные',
        'content': function (callback) {
            $.getJSON('Receipts.json', function (ReceiptObjects) {
                const $content = $('<ul>');
                for (let i = 0; i < ReceiptObjects.length; i++) {
                    if (ReceiptObjects[i].status !== 'Не оплачено') continue;
                    const clickCallback = () => $('.tabs a:nth-child(2) span').trigger('click');
                    const $ReceiptListItem = liaWithEditOrDeleteOnClick(ReceiptObjects[i], clickCallback);
                    $content.append($ReceiptListItem);
                }
                callback(null, $content);
            }).fail(jqXHR => callback(jqXHR.status, null));
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
        const $aElement = $('<a>').attr('href', '');
        const $spanElement = $('<span>').text(tab.name);

        $aElement.append($spanElement);
        $('main .tabs').append($aElement);

        $spanElement.on('click', function () {
            $('.tabs a span').removeClass('active');
            $spanElement.addClass('active');
            $('main .content').empty();
            tab.content(function (errorStatus, $content) {
                if (errorStatus !== null) {
                    alert('Возникла проблема при обработке запроса: ' + errorStatus);
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
