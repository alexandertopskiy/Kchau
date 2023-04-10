## Запуск сервера на виртуальной машине

Данный проект работает с

-   [Virtualbox](https://www.virtualbox.org/wiki/Download_Old_Builds_5_2) (v5.2.44)
-   [Ubuntu](https://releases.ubuntu.com/16.04/ubuntu-16.04.6-desktop-i386.iso) (v16.04)

### Создание виртуальной машины Ubuntu в Virtualbox

-   Установка Virtualbox
-   Devices - Insert...

```
sudo apt-get install virtualbox-guest-dkms
```

-   Общая папка - Папка - Автоподключение
-   Сеть - Сетевой мост
-   В терминале Ubuntu выполнить команды:

```
sudo adduser USER vboxsf
sudo apt-get update
sudo apt install nodejs
sudo apt update
sudo apt install -y mongodb
sudo apt install net-tools
```

### Установка зависимостей

```
npm install
```

### Запуск сервера

```
node server.js
```

### Консоль управления mongodb (при активном сервере)

В **другом** окне терминала выполнить команду:

```
mongo
```

### Поиск сети, к которой подключаться

```
ifconfig
```

## Запуск сервера локально

Для локального запуска на машине должны быть установлены [Node.js](https://nodejs.org/en/) и MongoDB [MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/)

-   Установка MongoDB для MacOS (на февраль 2023):

```bash
xcode-select --install
brew tap mongodb/brew
brew install mongodb-community

sudo mkdir -p /System/Volumes/Data/data/db # mongodb data directory
sudo chown -R `id -un` /System/Volumes/Data/data/db
```

-   Также находясь в [директории сервера](./server/) необходимо установить все зависимости:

```bash
npm install # установка всех зависимостей
```

Непосредственно запуск состоит из следующих этапов:

1. Запуск сервера mongodb (НУЖНО ЗАПУСКАТЬ КАЖДЫЙ РАЗ ВМЕСТЕ С ПРИЛОЖЕНИЕМ!)

```bash
sudo mongod --dbpath /System/Volumes/Data/data/db # (ctrl+c для выхода/завершения)

# в другом окне терминала (при активном сервере можно запустить консоли управления mongodb)
mongosh # (написать 'quit' для выхода)
```

2. Запуск приложения (находясь в [директории сервера](./server/)):

```bash
npm start
# или
node server.js
```

Оба пункта (запуск сервера mongodb и приложения) необхоимо выполнять каждый раз

## Управление базой данных

-   `mongo` - режим управления mongoDB (для Ubuntu)
-   `show dbs` показать все базы данных
-   `use NAME` - подключиться (выбрать) конкретную базу данных (в данном случае Name - это `ParkingForMen`)
-   `show collections` - вывод всех коллекций
-   `db.users.find().pretty()` - вывод всех пользователей
-   `db.receipts.find().pretty()` - вывод всех объявлений

Полный список команд доступен в [документации](https://www.mongodb.com/docs/mongodb-shell/run-commands/)

## Описание

### server.js

-   [Файл server.js](./server.js) отвечает за логику взаимодействия клиента с сервером
-   Следующие строки отвечают за определение типов запросов к серверу (при отправке клиентом запроса в этих строках будет вызван метод, соответствующий методу/типу запроса)

    ```js
    // Запросы для Пользователей
    app.get('/users.json', UsersController.index);
    app.post('/users', UsersController.create);
    // ...
    // ...
    // ...
    app.delete('/users/:username/receipts/:id', ReceiptController.destroy);
    ```

-   например, если клиент вызвал **post запрос** для **"/users"**, то в **server.js**, что данному запросу соответствует метод **UsersController.create** и этот метод будет вызван

### Модели (meal, menu, user)

-   [В этих файлах](./models/) описываются модели базы данных, их струкруры/схемы.
-   Так программа будет понимать, с какими свойствами нужно создавать объекты и какие свойства можно прочитать у уже созданных объектов

### Контроллеры

-   [В этих файлах](./controllers/) описывается логика взаимодействия с моделями базы данных
-   В каждом файле есть методы
    -   индексации (проверка существования)
    -   создания
    -   обновления
    -   удаления
    -   отображения
-   Эти методы обращаются к **json-файлам**, содержащим объекты конкретной модели и работают с ними
