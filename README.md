# UranawWeb - Telegram Mini App

Telegram Mini App для отображения информации о фэнтези турнирах РПЛ от бота UranaBot.

## 🚀 Технологии

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [@telegram-apps SDK](https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/2-x)
- [Telegram UI](https://github.com/Telegram-Mini-Apps/TelegramUI)
- [Vite 7](https://vitejs.dev/)
- [React Router DOM 7](https://reactrouter.com/)

## 📋 Описание проекта

UranawWeb - это веб-интерфейс для Telegram Mini App, который обеспечивает красивое отображение:

- Информации о турнирах РПЛ
- Статистики фэнтези лиги  
- Данных об игроках и командах
- Результатов матчей

Интегрируется с основным ботом [UranaBot](https://github.com/usebooz/UranaBot) для получения данных через Sports.ru API.

## 🛠 Установка

Клонируйте проект и установите зависимости:

```bash
git clone https://github.com/usebooz/UranaWeb.git
cd UranaWeb
npm install
```

## 🎯 Доступные скрипты

- `npm run dev` - Запуск в режиме разработки
- `npm run dev:https` - Запуск с HTTPS (требуется для Telegram)
- `npm run build` - Сборка для production
- `npm run lint` - Проверка кода ESLint
- `npm run lint:fix` - Автоисправление ESLint
- `npm run format` - Форматирование кода Prettier
- `npm run deploy` - Деплой на GitHub Pages

## 🔧 Разработка

### Локальный запуск

Для разработки рекомендуется использовать HTTPS:

```bash
npm run dev:https
```

После запуска вы увидите:

```bash
VITE v7.1.1  ready in 331 ms

➜  Local:   https://localhost:5173/UranaWeb/
➜  Network: https://192.168.1.100:5173/UranaWeb/
```

Откройте `Local` ссылку в браузере.

### Важные особенности

- **Mock Environment**: Файл `src/mockEnv.ts` симулирует Telegram окружение для разработки в браузере
- **SSL Сертификаты**: При первом запуске `dev:https` может потребоваться пароль администратора для создания локальных SSL сертификатов
- **Mobile Testing**: Android/iOS могут не доверять самоподписанным сертификатам

## 🚀 Деплой

### GitHub Pages (Автоматический)

Проект автоматически деплоится на GitHub Pages при push в ветку `main` через [GitHub Actions](.github/workflows/github-pages-deploy.yml).

URL приложения: <https://usebooz.github.io/UranaWeb>

### Ручной деплой

Для ручного деплоя выполните:

```bash
npm run build
npm run deploy
```

### Настройка деплоя

Если вы форкаете проект:

1. Измените `homepage` в `package.json`:

```json
{
  "homepage": "https://your-username.github.io/your-repo-name"
}
```

1. Измените `base` в `vite.config.ts`:

```ts
export default defineConfig({
  base: '/your-repo-name/',
  // ...
});
```

## 📚 Полезные ссылки

- [Telegram Mini Apps Platform](https://docs.telegram-mini-apps.com/)
- [@telegram-apps/sdk-react](https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk-react)
- [Telegram Developers Chat](https://t.me/devs)
- [UranaBot Repository](https://github.com/usebooz/UranaBot)
