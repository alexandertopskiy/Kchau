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

1. Установить [Node.js](https://nodejs.org/en/)

2. Установить [MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/)  
   Для MacOS (на февраль 2023):

```bash
xcode-select --install
brew tap mongodb/brew
brew install mongodb-community

sudo mkdir -p /System/Volumes/Data/data/db # mongodb data directory
sudo chown -R `id -un` /System/Volumes/Data/data/db

# НУЖНО ЗАПУСКАТЬ КАЖДЫЙ РАЗ ВМЕСТЕ С ПРИЛОЖЕНИЕМ!
sudo mongod --dbpath /System/Volumes/Data/data/db # запуск сервера mongodb (ctrl+c для выхода/завершения)

# в другом окне терминала (при активном сервере)
mongosh # запуск консоли управления mongodb (для выхода написать 'quit')
```

3. Находясь в [директории сервера](./server/) запустить в терминале команды:

```bash
npm install # установка всех зависимостей

npm start
# или
node server.js
```

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
