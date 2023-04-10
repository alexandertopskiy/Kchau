import { validateLicensePlate } from './helpers.js';

const main = function (UsersObjects) {
    'use strict';

    // UI-элементы (поле ввода номера и кнопки)
    const $input = $("<input placeholder='а777аа777'>").addClass('username');
    const $butLogin = $('<button>').text('Войти');
    const $butRegister = $('<button>').text('Зарегистрироваться в системе');
    const $butEdit = $('<button>').text(' Поменять номер');
    const $butDestroy = $('<button>').text('Удалить из системы');

    // метод валидации введенного номера
    const validatedInput = () => {
        const username = $input.val().trim();
        if (!username) alert('Сначала введите номер');
        else if (!validateLicensePlate(username)) {
            alert('Введенные данные не соответствуют формату гос.номера РФ!\nПовторите ввод');
        } else return username;

        $input.val('');
        return false;
    };

    // метод для логина (вынесен в отдельный метод для переиспользования)
    const login = () => {
        const username = validatedInput();
        if (!username) return;

        $.ajax({
            'url': '/users/' + username,
            'type': 'GET'
        })
            // переход на страницу пользователя
            .done(() => window.location.replace('users/' + username + '/'))
            .fail(jqXHR => {
                if (jqXHR.status === 404) alert('Пользователя не существует!');
                else alert('Произошла ошибка! Повторите попытку позже!');
            });
    };
    // обработка нажатия "enter"
    $input.on('keydown', e => {
        if (e.which === 13) login();
    });

    // Обработка нажатий на кнопки
    $butLogin.on('click', () => login());

    $butRegister.on('click', () => {
        const username = validatedInput();
        if (!username) return;

        const newUser = { 'username': username };
        $.post('users', newUser, () => UsersObjects.push(newUser))
            .done(() => {
                alert('Аккаунт успешно создан!');
                $butLogin.trigger('click');
            })
            .fail(jqXHR => {
                if (jqXHR.status === 501) alert('Такой номер уже зарегистрирован!\nВведите другой номер ');
                else alert('Произошла ошибка! Повторите попытку позже!');
            });
    });

    $butEdit.on('click', () => {
        const username = validatedInput();
        if (!username) return;

        const newUsername = prompt('Введите новый гос.номер, который будет закреплен за Вашим профилем', $input.val());
        if (!newUsername.trim() || !validateLicensePlate(newUsername)) {
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
            .fail(jqXHR => {
                if (jqXHR.status === 404) alert('Пользователя не существует!');
                else if (jqXHR.status === 501) alert('Пользователь с таким номером уже существует!');
                else alert('Произошла ошибка! Повторите попытку позже!');
            });
    });

    $butDestroy.on('click', () => {
        const username = validatedInput();
        if (!username) return;

        if (!confirm('Вы уверены, что хотете удалить профиль ' + username + '?')) return;

        $.ajax({
            'url': '/users/' + username,
            'type': 'DELETE'
        })
            .done(() => {
                $input.val('');
                alert('Ваш профиль успешно удален');
            })
            .fail(jqXHR => {
                if (jqXHR.status === 404) alert('Пользователя не существует!');
                else alert('Произошла ошибка! Повторите попытку позже!');
            });
    });

    $('main .authorization .form').append($input);
    [$butLogin, $butRegister, $butEdit, $butDestroy].forEach(el => {
        $('main .authorization .buttons').append(el);
    });
};

$(document).ready(() => $.getJSON('users.json', UsersObjects => main(UsersObjects)));
