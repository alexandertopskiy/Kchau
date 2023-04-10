import { getFormattedDate } from './helpers.js';

const createReceiptItem = (receipt, callback) => {
    const $listItem = $('<li>').text(receipt.description);
    const $actionLink = $('<a>').attr('href', 'Receipts/' + receipt._id);

    const payHandler = () => {
        const newDescription = receipt.description + '[Оплачено]';

        if (newDescription !== null && newDescription.trim() !== '')
            $.ajax({
                'url': '/Receipts/' + receipt._id,
                'type': 'PUT',
                'data': { 'description': newDescription, 'status': 'Оплачено' }
            })
                .done(() => {
                    receipt.status = 'Оплачено';
                    alert('Квитанция успешно оплачена');
                    callback();
                })
                .fail(jqXHR => {
                    if (jqXHR.status === 404) alert('Такой квитанции не существует!');
                    else alert('Произошла ошибка! Повторите попытку позже!');
                });

        return false;
    };
    const deleteHandler = () => {
        $.ajax({
            url: '/Receipts/' + receipt._id,
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
    };

    if (receipt.status === 'Не оплачено')
        $actionLink.addClass('link link-edit').text('Оплатить').on('click', payHandler);
    else $actionLink.addClass('link link-remove').text('Удалить').on('click', deleteHandler);

    $listItem.append($actionLink);
    return $listItem;
};

const main = function () {
    'use strict';

    // создание пустого массива с вкладками
    const tabs = [];

    // Вкладка "Новые"
    tabs.push({
        'name': 'Мои квитанции',
        'content': callback => {
            $.getJSON('Receipts.json', receipts => {
                const $content = $('<ul>');

                if (receipts.length === 0) $content.append($('<h3>').text('Квитанции не найдены!'));
                for (let i = receipts.length - 1; i >= 0; i--) {
                    const clickCallback = () => $('.tabs a:first-child span').trigger('click');
                    const $listItem = createReceiptItem(receipts[i], clickCallback);
                    $content.append($listItem);
                }

                callback(null, $content);
            }).fail(jqXHR => callback(jqXHR.status, null));
        }
    });

    // Вкладка "Неоплаченные"
    tabs.push({
        'name': 'Неоплаченные',
        'content': callback => {
            $.getJSON('Receipts.json', receipts => {
                const $content = $('<ul>');
                const unpaidReceipts = receipts.filter(receipt => receipt.status === 'Не оплачено');
                console.log(unpaidReceipts);

                if (unpaidReceipts.length === 0) $content.append($('<h3>').text('Все квитанции оплачены!'));
                for (let i = 0; i < unpaidReceipts.length; i++) {
                    const clickCallback = () => $('.tabs a:nth-child(2) span').trigger('click');
                    const $listItem = createReceiptItem(unpaidReceipts[i], clickCallback);
                    $content.append($listItem);
                }

                callback(null, $content);
            }).fail(jqXHR => callback(jqXHR.status, null));
        }
    });

    // Вкладка "Добавить"
    tabs.push({
        'name': 'Добавить',
        'content': callback => {
            const $content = $('<div>').addClass('add-form');
            const $inputTitle = $('<h3>').text('Введите новерок на стоянке: ');
            const $input = $('<input>').addClass('description');
            const $checkbox = $('<input type="checkbox">');
            const $label = $('<label>').addClass('form-control').append([$checkbox, 'Уже оплачено']);
            const $button = $('<button>').text('Добавить');
            [$inputTitle, $input, $label, $button].forEach(el => $content.append(el));

            const createReceipt = () => {
                const receiptNumber = $input.val().trim();

                if (!receiptNumber) {
                    alert('Сначала введите номер!');
                    return;
                }

                const currentDate = getFormattedDate();
                const isPaid = $checkbox.is(':checked');
                const description = '№' + receiptNumber + ' (' + currentDate + ')' + (isPaid ? ' [Оплачено]' : '');
                const status = isPaid ? 'Оплачено' : 'Не оплачено';

                const newReceipt = { 'description': description, 'status': status };

                $.post('Receipts', newReceipt, () => $('.tabs a:first-child span').trigger('click')).fail(jqXHR =>
                    callback(jqXHR.status, null)
                );
            };

            $button.on('click', () => createReceipt());
            // обработка нажатия "enter"
            $input.on('keydown', e => {
                if (e.which === 13) createReceipt();
            });

            callback(null, $content);
        }
    });

    // Вкладка "Выйти"
    tabs.push({
        'name': 'Выйти',
        'content': () => (document.location.href = '/index.html')
    });

    tabs.forEach(tab => {
        const $aElement = $('<a>').attr('href', '');
        const $spanElement = $('<span>').text(tab.name);

        $aElement.append($spanElement);
        $('main .tabs').append($aElement);

        $spanElement.on('click', () => {
            $('.tabs a span').removeClass('active');
            $spanElement.addClass('active');
            $('main .content').empty();
            tab.content((errorStatus, $content) => {
                if (errorStatus !== null) alert('Возникла проблема при обработке запроса: ' + errorStatus);
                else $('main .content').append($content);
            });
            return false;
        });
    });

    // при открытии страницы выбирать 1-ю вкладку
    $('.tabs a:first-child span').trigger('click');
};

$(document).ready(main);
