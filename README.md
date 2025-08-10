# UranawWeb - Telegram Mini App

Telegram Mini App для отображения информации о фэнтези турнирах РПЛ от бота UranaBot.

Построен с использованием современных технологий:

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [@telegram-apps SDK](https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/2-x)
- [Telegram UI](https://github.com/Telegram-Mini-Apps/TelegramUI)
- [Vite](https://vitejs.dev/)

## Описание проекта

UranawWeb - это веб-интерфейс для Telegram Mini App, который обеспечивает красивое отображение:

- Информации о турнирах РПЛ
- Статистики фэнтези лиги  
- Данных об игроках и командах
- Результатов матчей

Интегрируется с основным ботом [UranaBot](https://github.com/usebooz/UranaBot) для получения данных через Sports.ru API.

## Установка зависимостей

Если вы только что клонировали этот проект, установите зависимости:
dependencies using the command:

```Bash
npm install
```

## Scripts

This project contains the following scripts:

- `dev`. Runs the application in development mode.
- `dev:https`. Runs the application in development mode using locally created valid SSL-certificates.
- `build`. Builds the application for production.
- `lint`. Runs [eslint](https://eslint.org/) to ensure the code quality meets
  the required standards.
- `deploy`. Deploys the application to GitHub Pages.

To run a script, use the `npm run` command:

```Bash
npm run {script}
# Example: npm run build
```

## Create Bot and Mini App

Before you start, make sure you have already created a Telegram Bot. Here is
a [comprehensive guide](https://docs.telegram-mini-apps.com/platform/creating-new-app)
on how to do it.

## Run

Although Mini Apps are designed to be opened
within [Telegram applications](https://docs.telegram-mini-apps.com/platform/about#supported-applications),
you can still develop and test them outside of Telegram during the development
process.

To run the application in the development mode, use the `dev` script:

```bash
npm run dev:https
```

> [!NOTE]
> As long as we use [vite-plugin-mkcert](https://www.npmjs.com/package/vite-plugin-mkcert),
> launching the dev mode for the first time, you may see sudo password request.
> The plugin requires it to properly configure SSL-certificates. To disable the plugin, use the `npm run dev` command.

After this, you will see a similar message in your terminal:

```bash
VITE v6.2.4  ready in 237 ms

➜  Local:   https://localhost:5173/
➜  Network: https://172.18.16.1:5173/
➜  Network: https://172.19.32.1:5173/
➜  Network: https://192.168.0.171:5173/
➜  press h + enter to show help
```

Для просмотра приложения откройте `Local` ссылку
(`https://localhost:5173/` в этом примере) в браузере.

Важно отметить, что некоторые библиотеки в этом проекте, такие как
`@telegram-apps/sdk`, предназначены для использования только в Telegram.

Тем не менее, они работают корректно в браузере благодаря файлу
`src/mockEnv.ts`, который импортируется в точке входа приложения
(`src/index.ts`) и использует функцию `mockTelegramEnv` для симуляции
Telegram окружения. Этот трюк убеждает приложение, что оно работает в
Telegram среде. Поэтому будьте осторожны и не используйте эту функцию
в production режиме без полного понимания её последствий.

> [!WARNING]
> Поскольку мы используем самоподписанные SSL сертификаты, Android и iOS
> приложения Telegram не смогут отобразить приложение. Эти операционные
> системы применяют более строгие меры безопасности, препятствующие загрузке
> Mini App. Для решения этой проблемы обратитесь к
> [этому руководству](https://docs.telegram-mini-apps.com/platform/getting-app-link#remote).

Для просмотра приложения откройте `Local` ссылку 
(`https://localhost:5173/` в этом примере) в браузере.

Важно отметить, что некоторые библиотеки в этом проекте, такие как
`@telegram-apps/sdk`, предназначены для использования только в Telegram.

Тем не менее, они работают корректно в браузере благодаря файлу
`src/mockEnv.ts`, который импортируется в точке входа приложения 
(`src/index.ts`) и использует функцию `mockTelegramEnv` для симуляции 
Telegram окружения. Этот трюк убеждает приложение, что оно работает в 
Telegram среде. Поэтому будьте осторожны и не используйте эту функцию 
в production режиме без полного понимания её последствий.

> [!WARNING]
> Поскольку мы используем самоподписанные SSL сертификаты, Android и iOS 
> приложения Telegram не смогут отобразить приложение. Эти операционные 
> системы применяют более строгие меры безопасности, препятствующие загрузке 
> Mini App. Для решения этой проблемы обратитесь к 
> [этому руководству](https://docs.telegram-mini-apps.com/platform/getting-app-link#remote).

## Deploy

This boilerplate uses GitHub Pages as the way to host the application
externally. GitHub Pages provides a CDN which will let your users receive the
application rapidly. Alternatively, you could use such services
as [Heroku](https://www.heroku.com/) or [Vercel](https://vercel.com).

### Manual Deployment

This boilerplate uses the [gh-pages](https://www.npmjs.com/package/gh-pages)
tool, which allows deploying your application right from your PC.

#### Configuring

Before running the deployment process, ensure that you have done the following:

1. Replaced the `homepage` value in `package.json`. The GitHub Pages deploy tool
   uses this value to
   determine the related GitHub project.
2. Replaced the `base` value in `vite.config.ts` and have set it to the name of
   your GitHub
   repository. Vite will use this value when creating paths to static assets.

For instance, if your GitHub username is `telegram-mini-apps` and the repository
name is `is-awesome`, the value in the `homepage` field should be the following:

```json
{
  "homepage": "https://telegram-mini-apps.github.io/is-awesome"
}
```

And `vite.config.ts` should have this content:

```ts
export default defineConfig({
  base: '/is-awesome/',
  // ...
});
```

You can find more information on configuring the deployment in the `gh-pages`
[docs](https://github.com/tschaub/gh-pages?tab=readme-ov-file#github-pages-project-sites).

#### Before Deploying

Before deploying the application, make sure that you've built it and going to
deploy the fresh static files:

```bash
npm run build
```

Then, run the deployment process, using the `deploy` script:

```Bash
npm run deploy
```

After the deployment completed successfully, visit the page with data according
to your username and repository name. Here is the page link example using the
data mentioned above:
https://telegram-mini-apps.github.io/is-awesome

### GitHub Workflow

To simplify the deployment process, this template includes a
pre-configured [GitHub workflow](.github/workflows/github-pages-deploy.yml) that
automatically deploys the project when changes are pushed to the `master`
branch.

To enable this workflow, create a new environment (or edit the existing one) in
the GitHub repository settings and name it `github-pages`. Then, add the
`master` branch to the list of deployment branches.

You can find the environment settings using this
URL: `https://github.com/{username}/{repository}/settings/environments`.

![img.png](.github/deployment-branches.png)

In case, you don't want to do it automatically, or you don't use GitHub as the
project codebase, remove the `.github` directory.

### GitHub Web Interface

Alternatively, developers can configure automatic deployment using the GitHub
web interface. To do this, follow the link:
`https://github.com/{username}/{repository}/settings/pages`.

## TON Connect

This boilerplate utilizes
the [TON Connect](https://docs.ton.org/develop/dapps/ton-connect/overview)
project to demonstrate how developers can integrate functionality related to TON
cryptocurrency.

The TON Connect manifest used in this boilerplate is stored in the `public`
folder, where all publicly accessible static files are located. Remember
to [configure](https://docs.ton.org/develop/dapps/ton-connect/manifest) this
file according to your project's information.

## Useful Links

- [Platform documentation](https://docs.telegram-mini-apps.com/)
- [@telegram-apps/sdk-react documentation](https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk-react)
- [Telegram developers community chat](https://t.me/devs)
