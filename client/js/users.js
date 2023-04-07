const main = function (UsersObjects) {
    'use strict';

    // валидация гос.номера
    const validateLicensePlate = plate => {
        const example = /^[АВЕКМНОРСТУХ]\d{3}(?<!000)[АВЕКМНОРСТУХ]{2}\d{2,3}$/iu;
        return example.test(plate);
    };

    const $input = $("<input placeholder='а777аа777'>").addClass('username');
    const $butRegister = $('<button>').text('Зарегистрироваться в системе');
    const $butLogin = $('<button>').text('Войти');
    const $butEdit = $('<button>').text(' Поменять номер');
    const $butDestroy = $('<button>').text('Удалить из системы');

    $butLogin.on('click', function () {
        const username = $input.val();
        if (username === null || username.trim() === '') {
            alert('Сначала введите номер');
            return;
        }

        $.ajax({
            'url': '/users/' + username,
            'type': 'GET'
        })
            .done(() => {
                // переход на страницу пользователя
                window.location.replace('users/' + username + '/');
            })
            .fail(function (jqXHR) {
                if (jqXHR.status === 404) alert('Пользователя не существует!');
                else alert('Произошла ошибка! Повторите попытку позже!');
            });
    });

    $butRegister.on('click', function () {
        const username = $input.val();
        if (username === null || username.trim() === '') {
            alert('Сначала введите номер');
            return;
        }

        if (!validateLicensePlate(username)) {
            alert('Введенные данные не соответствуют формату гос.номера РФ!\nПовторите ввод');
            $input.val('');
            return;
        }

        const newUser = { 'username': username };
        $.post('users', newUser, () => UsersObjects.push(newUser))
            .done(() => {
                alert('Аккаунт успешно создан!');
                $butLogin.trigger('click');
            })
            .fail(function (jqXHR) {
                if (jqXHR.status === 501) alert('Такой номер уже зарегистрирован!\nВведите другой номер ');
                else alert('Произошла ошибка! Повторите попытку позже!');
            });
    });

    $butEdit.on('click', function () {
        const username = $input.val();
        if (username === null || username.trim() === '') {
            alert('Сначала введите номер');
            return;
        }

        const newUsername = prompt('Введите новый гос.номер, который будет закреплен за Вашим профилем', $input.val());
        if (newUsername === null || newUsername === username) return;
        if (!validateLicensePlate(newUsername)) {
            alert('Введенные данные не соответствуют формату гос.номера РФ!\nПовторите ввод');
            return;
        }

        $.ajax({
            'url': '/users/' + username,
            'type': 'PUT',
            'data': { 'username': newUsername }
        })
            .done(() => {
                alert('Ваш гос.номер успешно изменен');
                $input.val(newUsername);
            })
            .fail(function (jqXHR) {
                if (jqXHR.status === 404) alert('Пользователя не существует!');
                else if (jqXHR.status === 501) alert('Пользователь с таким номером уже существует!');
                else alert('Произошла ошибка! Повторите попытку позже!');
            });
    });

    $butDestroy.on('click', function () {
        const username = $input.val();
        if (username === null || username.trim() === '') {
            alert('Сначала введите номер');
            return;
        }

        if (!confirm('Вы уверены, что хотете удалить профиль ' + username + '?')) return;

        $.ajax({
            'url': '/users/' + username,
            'type': 'DELETE'
        })
            .done(() => {
                $input.val('');
                alert('Ваш профиль успешно удален');
            })
            .fail(function (jqXHR) {
                if (jqXHR.status === 404) alert('Пользователя не существует!');
                else alert('Произошла ошибка! Повторите попытку позже!');
            });
    });

    $('main .authorization .form').append($input);
    [$butLogin, $butRegister, $butEdit, $butDestroy].forEach(el => {
        $('main .authorization .buttons').append(el);
    });
};

$(document).ready(function () {
    $.getJSON('users.json', function (UsersObjects) {
        main(UsersObjects);
    });
});
