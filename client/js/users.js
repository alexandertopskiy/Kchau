var main = function (UsersObjects) {
    'use strict';

    var $input = $("<input placeholder='а777аа777'>").addClass('username'),
        $butRegister = $('<button>').text('Зарегистрироваться в системе'),
        $butLogin = $('<button>').text('Войти'),
        $butEdit = $('<button>').text(' Поменять номер'),
        $butDestroy = $('<button>').text('Удалить из системы');

    $butRegister.on('click', function () {
        var username = $input.val();

        // регулярное выражение для валидации гос.номера
        var example = /^[АВЕКМНОРСТУХ]\d{3}(?<!000)[АВЕКМНОРСТУХ]{2}\d{2,3}$/iu;
        var check = example.test(username);

        if (check) {
            var newUser = { 'username': username };
            $.post('users', newUser, () => {
                UsersObjects.push(newUser); // отправляем на клиент
            })
                .done(() => {
                    alert('Аккаунт успешно создан!');
                    $butLogin.trigger('click');
                })
                .fail(function (jqXHR) {
                    if (jqXHR.status === 501) alert('Такой номер уже зарегистрирован!\nВведите другой номер ');
                    else alert('Произошла ошибка! Повторите попытку позже!');
                });
        } else {
            alert('Введенные данные не соответствуют формату гос.номера РФ!\nПовторите ввод');
            $input.val('');
        }
    });

    $butLogin.on('click', function () {
        var username = $input.val();

        if (username !== null && username.trim() !== '') {
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
        }
    });

    $butEdit.on('click', function () {
        if ($input.val() !== '') {
            if ($input.val() !== null && $input.val().trim() !== '') {
                var username = $input.val();
                var newUsername = prompt(
                    'Введите новый гос.номер, который будет закреплен за Вашим профилем',
                    $input.val()
                );
                if (newUsername !== null && newUsername.trim() !== '') {
                    $.ajax({
                        'url': '/users/' + username,
                        'type': 'PUT',
                        'data': { 'username': newUsername }
                    })
                        .done(function (responde) {
                            console.log(responde);
                            $input.val(newUsername);
                            alert('Ваш гос.номер успешно изменен');
                        })
                        .fail(function (jqXHR, textStatus, error) {
                            console.log(error);
                            alert('Произошла ошибка!\n' + jqXHR.status + ' ' + jqXHR.textStatus);
                        });
                }
            }
        }
    });

    $butDestroy.on('click', function () {
        if ($input.val() !== '') {
            if ($input.val() !== null && $input.val().trim() !== '') {
                var username = $input.val();
                if (confirm('Вы уверены, что хотете удалить профиль ' + username + '?')) {
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
                }
            }
        }
    });

    $('main .authorization').append($input);
    $('main .authorization').append($butDestroy);
    $('main .authorization').append($butEdit);
    $('main .authorization').append($butLogin);
    $('main .authorization').append($butRegister);
};

$(document).ready(function () {
    $.getJSON('users.json', function (UsersObjects) {
        main(UsersObjects);
    });
});
