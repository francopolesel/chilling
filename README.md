# Chilling — pick something to do

> **Read in:** [English](#english) · [Español](#español)

---

<a id="english"></a>
## English

**Chilling** is a small, calm web app with 8 interactive mini-activities. No timers. No points. Nothing to finish — just tap anything and fiddle for a while.

### Features

- **8 activities:**
  - 🔷 Find the Different — find the odd one out
  - 🔀 Sort It — put each piece where it fits
  - 🃏 Memory — flip, match, repeat
  - 🔍 Find X — tap every matching one
  - 🎨 Color Lab — mix swatches freely
  - ✏️ Doodle — a blank page, draw anything (touch-friendly, works on iOS)
  - 🧩 Puzzle — tap two pieces to swap
  - ❓ Trivia — one question at a time
- **Panic Mode** — one tap starts a random activity immediately, with an "Another" button to switch.
- Calm, warm UI with no gamification pressure.
- Responsive layout (mobile-first, 2-col grid → 4-col on desktop).

### Tech stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite 6](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`)
- [lucide-react](https://lucide.dev/) for icons

### Quickstart

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open http://localhost:5173

### Scripts

| Command         | What it does              |
| --------------- | ------------------------- |
| `npm run dev`   | Start dev server          |
| `npm run build` | Type-check + build to `dist/` |
| `npm run preview` | Preview the production build |

### Project structure

```
src/
  App.tsx              # home + view routing (home / activity / panic)
  components/          # AppShell, ActivityCard, ActivityScreen, BackButton
  games/               # FindDifferent, SortIt, Memory, FindX, ColorLab, Doodle, Puzzle, Trivia
  data/trivia.ts       # trivia questions
  lib/random.ts        # random activity picker for Panic Mode
  index.css            # theme tokens, washes, shadows
```

### Philosophy

> No timers. No points. Nothing to finish.

---

<a id="español"></a>
## Español

**Chilling** es una app web pequeña y tranquila con 8 mini-actividades interactivas. Sin temporizadores. Sin puntos. Nada que terminar — solo tocá algo y distraete un rato.

### Funcionalidades

- **8 actividades:**
  - 🔷 Encuentra el Diferente — encontrá el que no encaja
  - 🔀 Ordénalo — poné cada pieza donde corresponde
  - 🃏 Memoria — da vuelta, combiná, repetí
  - 🔍 Encuentra X — tocá todos los que coincidan
  - 🎨 Laboratorio de Color — mezclá muestras libremente
  - ✏️ Garabato — una página en blanco, dibujá lo que quieras (táctil, funciona en iOS)
  - 🧩 Rompecabezas — tocá dos piezas para intercambiarlas
  - ❓ Trivia — una pregunta a la vez
- **Modo Pánico** — con un toque arranca una actividad al azar, con botón "Otra" para cambiar.
- Interfaz cálida y tranquila, sin presión de juego.
- Diseño responsive (mobile-first, grilla de 2 columnas → 4 en escritorio).

### Stack tecnológico

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite 6](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) (vía `@tailwindcss/vite`)
- [lucide-react](https://lucide.dev/) para los iconos

### Inicio rápido

Requisitos: Node.js 18+ y npm.

```bash
npm install
npm run dev
```

Abrí http://localhost:5173

### Scripts

| Comando           | Qué hace                        |
| ----------------- | ------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo |
| `npm run build`   | Chequeo de tipos + build a `dist/` |
| `npm run preview` | Previsualiza el build de producción |

### Estructura del proyecto

```
src/
  App.tsx              # home + ruteo de vistas (home / activity / panic)
  components/          # AppShell, ActivityCard, ActivityScreen, BackButton
  games/               # FindDifferent, SortIt, Memory, FindX, ColorLab, Doodle, Puzzle, Trivia
  data/trivia.ts       # preguntas de trivia
  lib/random.ts        # selector aleatorio para el Modo Pánico
  index.css            # tokens de tema, washes, sombras
```

### Filosofía

> Sin temporizadores. Sin puntos. Nada que terminar.
