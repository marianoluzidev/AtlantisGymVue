# AtlantisGym

## Framework7 CLI Options

Framework7 app created with following options:

```
{
  "cwd": "C:\\angular_proj\\AtlantisGym",
  "type": [
    "pwa",
    "web"
  ],
  "name": "AtlantisGym",
  "framework": "vue",
  "template": "tabs",
  "cssPreProcessor": false,
  "bundler": "vite",
  "theming": {
    "customColor": true,
    "color": "#000000",
    "darkMode": false,
    "iconFonts": true
  },
  "customBuild": false
}
```

## Install Dependencies

First of all we need to install dependencies, run in terminal
```
npm install
```

## NPM Scripts

* 🔥 `start` - run development server
* 🔧 `dev` - run development server
* 🔧 `build` - build web app for production

## Vite

There is a [Vite](https://vitejs.dev) bundler setup. It compiles and bundles all "front-end" resources. You should work only with files located in `/src` folder. Vite config located in `vite.config.js`.

## PWA

This is a PWA. Don't forget to check what is inside of your `service-worker.js`. It is also recommended that you disable service worker (or enable "Update on reload") in browser dev tools during development.
## Assets

Assets (icons, splash screens) source images located in `assets-src` folder. To generate your own icons and splash screen images, you will need to replace all assets in this directory with your own images (pay attention to image size and format), and run the following command in the project directory:

```
framework7 assets
```

Or launch UI where you will be able to change icons and splash screens:

```
framework7 assets --ui
```



## Documentation & Resources

* [Framework7 Core Documentation](https://framework7.io/docs/)
* [Framework7 Vue Documentation](https://framework7.io/vue/)


* [Framework7 Icons Reference](https://framework7.io/icons/)
* [Community Forum](https://forum.framework7.io)

## Support Framework7

Love Framework7? Support project by donating or pledging on:
- Patreon: https://patreon.com/framework7
- OpenCollective: https://opencollective.com/framework7

## capacitator

npm run build
npx cap copy
npx cap open android
## para sincronizar android studio
npx cap sync android

## para deployar
npm run build
firebase deploy

- si hay algun problema borrar la carpeta android

REGLAS DEL STORAGE

rules_version = '2';

// Craft rules based on data in your Firestore database
// allow write: if firestore.get(
//    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
service firebase.storage {
  match /b/{bucket}/o {

    // This rule allows anyone with your Storage bucket reference to view, edit,
    // and delete all data in your Storage bucket. It is useful for getting
    // started, but it is configured to expire after 30 days because it
    // leaves your app open to attackers. At that time, all client
    // requests to your Storage bucket will be denied.
    //
    // Make sure to write security rules for your app before that time, or else
    // all client requests to your Storage bucket will be denied until you Update
    // your rules
    match /{allPaths=**} {
      allow read, write: if request.time < timestamp.date(2025, 5, 26);
    }
  }
}


Access Token: ya29.c.c0ASRK0GY_lSijMHH9-tjVigPIh8UlRdd_fjYEH0aTM0Xpl3XlUfnBdKeT3kpKYIlHqv8XjQfGyIrnu9MT43WYJPzIc0kJN-zf0P4Rzfvhy3o-W1uQF-ob9rH6yhPEjKjQ5CFLvPMw0_GV3p7j4OKCRWNcJ06dLMarvbVdYMGSMI8KJEbUp7zvkJsR4hmdkUEiFzgc62L9Qpptzr4LS4hq9qfBNRVFBTHoIp17jZgukacs6eQqYZvY7Ujq80zBefZbFrvWnp7jcYdBNHGhRor1wuAOpBQYSW7E_gmgF64V1o72FETljBYAL61fS33KkrmJdkbe7XBZvd9mXZt5X2218hj0G7o16wHS8-WTqBtLc9l4KfWcM18kzylUUAE387KZjgRYZeXmy6R0JSnRdW_dz1wry_9r8WvqWY6_3Mrxfd9wOQt9wc_V4J8nuddVXxIvQ2h8tXm7bvIdevfyF5aMJ9e2tydxIbeiWBZ2hZyd7yq112IY-VXUi8QFcejzpypVouqJxOmQSg6F36mOOO1BY5uV9pg2z4h3fuOQoqWkOu7z6z80hodh4y06g5lQftnIQf3hI4RzRh3WtJrZ3VBrgRqSskSbYV1eRxZnMl0MtFOg8nbyUcZRQ518roqijVcg7i8qmcdb90uz9lWsUegc5JtzSoB8-WpUoQmtcUM6FMeOervJ1irazVdj-bkjzr5vBckM_Fojj00gsxzWuajv_0fbx6M1B4vtbvZ3a2uoiIqneU3UrXZFBfYsWrSWowru0qbJW9fa6s9FvBsSlcaVFrUB7xQO0Vf_F55Z7t-9JFcZ5vYU6fjhbyJ_w86VY8mf3jXwes5Rgil0XMsw53wabvkJablUhzy6nzW3RheUJfWn2zhV6uY1ZVhuvmXSQQbx25b6tSmbnBr5FO57Fqi2FalXxlmwIBF2rhyU3-0225SmXVoBc6mFgZ5w4mg7vp-ioIdxyWrv-SIjcy2dUUJjzq3lXqmg2SiX0dS8Bm0bV7lF1x40aBZfSSI