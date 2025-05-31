# BeatFlow

[English version below]

## О проекте

**BeatFlow** — это современная open source музыкальная платформа нового поколения для прослушивания, поиска и обмена музыкой. Проект полностью открыт: я разрабатываю его самостоятельно, но приветствую любые pull request'ы, идеи и помощь от других разработчиков!

## Основные возможности

- 🔒 Регистрация и авторизация пользователей (JWT, bcrypt, защищённые API)
- 🚪 Logout и автоматическая защита приватных маршрутов
- 🎵 Просмотр топовых треков дня (Top Tunes)
- 🤖 Персональные рекомендации (Suggested Songs)
- 📚 Личная библиотека, плейлисты, загрузка треков (для авторизованных)
- ❤️ Лайки, избранное, социальные функции (дорабатываются)
- 🔍 Поиск по песням, артистам, плейлистам
- 🎧 Встроенный аудиоплеер с прогресс-баром, плей/пауза, следующий/предыдущий трек, громкость
- 🌐 Мультиязычность (EN/TJ/RU)
- 🖥️ Современный UI: Tailwind CSS, Framer Motion, адаптивная верстка, анимации, градиенты
- 🛡️ Безопасность: пароли в хэше, JWT, приватные API
- 🗄️ Backend на Node.js + Express, база данных PostgreSQL
- 🧩 Чистая архитектура: разделение client/server/shared, поддержка расширения
- 📝 Подробные логи, обработка ошибок, UX-friendly формы

## Как запустить

1. Клонируйте репозиторий:
   ```sh
   git clone https://github.com/yourusername/beatflow.git
   cd beatflow
   ```
2. Установите зависимости:
   ```sh
   npm install
   ```
3. Настройте .env (пример уже в репозитории)
4. Проведите миграции и запустите сервер:
   ```sh
   npm run db:push
   npm run dev
   ```
5. Откройте http://localhost:3000

## Вклад в проект

Проект развивается и дорабатывается! Если вы разработчик — присоединяйтесь:
- Открывайте issue с багами и идеями
- Делайте pull request'ы
- Пишите мне напрямую (контакты в профиле)

Любая помощь приветствуется: от багфиксов до новых фич и UI-улучшений!

## Лицензия

MIT. Проект полностью открыт для любых целей.

---

# BeatFlow

## About the Project

**BeatFlow** is a next-generation open source music platform for listening, discovering, and sharing music. The project is fully open: I develop it myself, but contributions, ideas, and help from other developers are very welcome!

## Features

- 🔒 User registration and authentication (JWT, bcrypt, protected API)
- 🚪 Logout and automatic protection of private routes
- 🎵 View top tracks of the day (Top Tunes)
- 🤖 Personalized recommendations (Suggested Songs)
- 📚 Personal library, playlists, track upload (for authenticated users)
- ❤️ Likes, favorites, social features (in progress)
- 🔍 Search by songs, artists, playlists
- 🎧 Built-in audio player with progress bar, play/pause, next/prev, volume
- 🌐 Multilanguage (EN/TJ/RU)
- 🖥️ Modern UI: Tailwind CSS, Framer Motion, responsive design, animations, gradients
- 🛡️ Security: hashed passwords, JWT, private API
- 🗄️ Backend: Node.js + Express, PostgreSQL database
- 🧩 Clean architecture: client/server/shared separation, extensible
- 📝 Detailed logging, error handling, UX-friendly forms

## Getting Started

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/beatflow.git
   cd beatflow
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure .env (example included)
4. Run migrations and start the server:
   ```sh
   npm run db:push
   npm run dev
   ```
5. Open http://localhost:3000

## Contributing

The project is actively developed and improved! If you're a developer — join in:
- Open issues for bugs and ideas
- Make pull requests
- Contact me directly (see profile)

Any help is welcome: from bugfixes to new features and UI improvements!

## License

MIT. The project is fully open for any use.
