# React + TypeScript + Vite + Tailwindcss

# DEBUG

## Https context during development!

### Install Homebrew FOR MAC

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

brew install mkcert

mkcert -install

mkcert localhost 192.168.4.41 169.254.157.205 169.254.102.214

### Install Homebrew FOR Windows

run command in powershell as admin

Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iwr https://chocolatey.org/install.ps1 -UseBasicParsing | iex

choco install mkcert

mkcert -install

mkcert localhost 192.168.4.41 169.254.157.205 169.254.102.214

# Deployment

swa deploy -n portal-one --env production

## Tailwindcss

Make sure to use the following command to run the tailwind compiler.

```
npx tailwindcss -i ./src/index.css -o ./build/assest/tailwind.css --watch
```

# Testing

## e2e

### How to View VS code as part of the external applications in cypress

To be more specific, in Visual Studio Code, go to View -> Command Pallete and paste this in there Install 'code' command in path then press Enter.

## Other...

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md)
  uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast
  Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
        sourceType
:
    'module',
        project
:
    ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir
:
    __dirname,
}
,
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked`
  or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and
  add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
