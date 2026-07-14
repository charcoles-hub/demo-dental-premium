# Scaffold plantilla dental premium — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir el scaffold técnico (Astro + ruta dinámica parametrizada por lead + pipeline de deploy) del repo `demo-dental-premium`, con un lead de ejemplo funcionando en producción, validado con capturas desktop y móvil. El diseño visual elaborado final lo construye después un agente separado (model `fable`) sobre este mismo scaffold — este plan NO incluye ese trabajo de diseño.

**Architecture:** Astro con ruta dinámica `getStaticPaths()` (`src/pages/c/[slug].astro`) que itera sobre un array tipado en `src/data/leads.ts`. Cada lead genera una página estática real (`/c/<slug>`). Deploy estático a GitHub Pages vía GitHub Actions, mismo patrón que los repos hermanos (`demo-dental-sereno`, `demo-veterinaria-manada`).

**Tech Stack:** Astro ^7, Tailwind CSS v4 (vía `@tailwindcss/vite`), Node ≥22.12, GitHub Actions (`withastro/action@v3`), GitHub Pages.

## Global Constraints

- Node >=22.12.0 (Astro lo exige) — replicar en `package.json` → `engines.node`.
- No trackear el symlink de `node_modules` en git (rompe `npm ci` en CI).
- No usar `pkill` en scripts de este repo (aborta con señal 144 en el entorno del proyecto).
- Datos de personalización por lead: exactamente `negocio`, `ciudad`, `telefono` — ningún otro campo (el spec descarta `PrimeraLinea` y contenido generado por IA en esta fase).
- Fuera de alcance en este plan: pipeline de generación masiva de leads reales, plantillas de otros rubros, retirada de `demo-dental-sereno`, y el diseño visual elaborado final (lo hace un agente `fable` después, no este plan).
- `<meta name="viewport">` correcto es obligatorio (mobile-first es mandato del spec) aunque el diseño final no se construya aquí.
- Repo GitHub: `charcoles-hub/demo-dental-premium` (misma cuenta/org que los repos hermanos), rama `main`.

---

### Task 1: Scaffold del proyecto Astro (config + dependencias)

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`

**Interfaces:**
- Produces: proyecto Astro instalable (`node_modules/`), comando `npx astro --version` operativo. Ningún consumidor previo (primer task).

- [ ] **Step 1: Crear `package.json`**

```json
{
  "name": "demo-dental-premium",
  "type": "module",
  "version": "0.0.1",
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.3.1",
    "astro": "^7.0.3",
    "tailwindcss": "^4.3.1"
  }
}
```

- [ ] **Step 2: Crear `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://charcoles-hub.github.io',
  base: '/demo-dental-premium',
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 3: Crear `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Crear `.gitignore`**

```
node_modules/
dist/
```

- [ ] **Step 5: Instalar dependencias**

Run: `cd ~/Proyectos/demo-dental-premium && npm install`
Expected: instala sin errores, se genera `package-lock.json` y `node_modules/`.

- [ ] **Step 6: Verificar que Astro está operativo**

Run: `npx astro --version`
Expected: imprime una versión `astro X.Y.Z` (7.x), sin errores.

- [ ] **Step 7: Commit**

```bash
cd ~/Proyectos/demo-dental-premium
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore
git commit -m "Scaffold inicial del proyecto Astro"
```

---

### Task 2: Datos del lead + Layout base + ruta dinámica por lead

**Files:**
- Create: `src/data/leads.ts`
- Create: `src/layouts/Layout.astro`
- Create: `src/styles/global.css`
- Create: `src/pages/c/[slug].astro`

**Interfaces:**
- Consumes: ninguna (usa solo Astro/Tailwind del Task 1).
- Produces:
  - `Lead` type (`{ slug: string; negocio: string; ciudad: string; telefono: string }`) y `leads: Lead[]` exportados desde `src/data/leads.ts` — la segunda ronda (pipeline masivo, fuera de este plan) ampliará este array.
  - `Layout.astro` con props `{ title: string; description: string }` y un `<slot />` — el agente `fable` reemplazará el `<body>` interno más adelante pero debe seguir aceptando estas mismas props.
  - Ruta pública `/c/<slug>` por cada entrada de `leads`.

- [ ] **Step 1: Crear `src/data/leads.ts` con el tipo y un lead de ejemplo**

```ts
export type Lead = {
  slug: string;
  negocio: string;
  ciudad: string;
  telefono: string;
};

export const leads: Lead[] = [
  {
    slug: 'clinica-dental-aurora',
    negocio: 'Clínica Dental Aurora',
    ciudad: 'Cornellà de Llobregat',
    telefono: '936000000',
  },
];
```

- [ ] **Step 2: Crear `src/styles/global.css`**

```css
@import "tailwindcss";

:root {
  color-scheme: light;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
```

- [ ] **Step 3: Crear `src/layouts/Layout.astro`**

```astro
---
import "../styles/global.css";

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 4: Crear `src/pages/c/[slug].astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import { leads, type Lead } from '../../data/leads';

export function getStaticPaths() {
  return leads.map((lead) => ({
    params: { slug: lead.slug },
    props: { lead },
  }));
}

const { lead } = Astro.props as { lead: Lead };
---
<Layout
  title={`${lead.negocio} · Odontología en ${lead.ciudad}`}
  description={`Sonríe con confianza. ${lead.negocio} te espera en ${lead.ciudad}.`}
>
  <main>
    <h1>{lead.negocio}</h1>
    <p>{lead.ciudad}</p>
    <p><a href={`tel:${lead.telefono}`}>{lead.telefono}</a></p>
  </main>
</Layout>
```

- [ ] **Step 5: Build y verificar que la página del lead se genera**

Run: `npm run build`
Expected: build sin errores, termina con algo como `1 page(s) built`.

- [ ] **Step 6: Verificar contenido del lead en el HTML generado**

Run: `grep -q "Clínica Dental Aurora" dist/c/clinica-dental-aurora/index.html && echo FOUND || echo NOT_FOUND`
Expected: `FOUND`

- [ ] **Step 7: Verificar meta viewport mobile presente**

Run: `grep -q 'name="viewport" content="width=device-width, initial-scale=1"' dist/c/clinica-dental-aurora/index.html && echo FOUND || echo NOT_FOUND`
Expected: `FOUND`

- [ ] **Step 8: Commit**

```bash
git add src/data/leads.ts src/layouts/Layout.astro src/styles/global.css src/pages/c/[slug].astro
git commit -m "Añadir datos del lead, layout base y ruta dinámica por lead"
```

---

### Task 3: Repo en GitHub + deploy automático a Pages

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: build de Astro del Task 2 (`npm run build` debe funcionar).
- Produces: repo público `charcoles-hub/demo-dental-premium` con Pages activo, sirviendo `https://charcoles-hub.github.io/demo-dental-premium/c/clinica-dental-aurora/`.

- [ ] **Step 1: Crear `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3
        with:
          node-version: 22
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "Añadir workflow de deploy a GitHub Pages"
```

- [ ] **Step 3: Crear el repo en GitHub y hacer push**

Run:
```bash
cd ~/Proyectos/demo-dental-premium
gh repo create charcoles-hub/demo-dental-premium --public --source=. --remote=origin --push
```
Expected: imprime la URL `https://github.com/charcoles-hub/demo-dental-premium`, rama `main` empujada.

- [ ] **Step 4: Activar GitHub Pages con origen "GitHub Actions"**

Run: `gh api -X POST repos/charcoles-hub/demo-dental-premium/pages -f build_type=workflow`
Expected: JSON con `"status":null` y `"build_type":"workflow"` (código 201), o error 409 si ya existía — en ambos casos continuar.

- [ ] **Step 5: Esperar a que termine el workflow de deploy**

Run:
```bash
until [ "$(gh run list --repo charcoles-hub/demo-dental-premium --limit 1 --json status --jq '.[0].status')" = "completed" ]; do sleep 5; done
gh run list --repo charcoles-hub/demo-dental-premium --limit 1 --json conclusion --jq '.[0].conclusion'
```
Expected: imprime `success`.

- [ ] **Step 6: Verificar que la página del lead está en producción**

Run: `curl -s https://charcoles-hub.github.io/demo-dental-premium/c/clinica-dental-aurora/ | grep -q "Clínica Dental Aurora" && echo LIVE || echo NOT_LIVE`
Expected: `LIVE`

---

### Task 4: Validación con capturas headless (desktop + móvil)

**Files:**
- Create: `.screenshots/` (directorio local, no se commitea)
- Modify: `.gitignore` (añadir `.screenshots/`)

**Interfaces:**
- Consumes: URL en producción del Task 3 (`https://charcoles-hub.github.io/demo-dental-premium/c/clinica-dental-aurora/`).
- Produces: dos archivos PNG (desktop y móvil) para que Sergio revise el scaffold antes de pasarlo a `fable`.

- [ ] **Step 1: Añadir `.screenshots/` a `.gitignore`**

```
node_modules/
dist/
.screenshots/
```

- [ ] **Step 2: Captura desktop (1440×900)**

Run:
```bash
mkdir -p ~/Proyectos/demo-dental-premium/.screenshots
chromium --headless=new --disable-gpu \
  --screenshot=$HOME/Proyectos/demo-dental-premium/.screenshots/desktop.png \
  --window-size=1440,900 --virtual-time-budget=4000 \
  "https://charcoles-hub.github.io/demo-dental-premium/c/clinica-dental-aurora/"
```
Expected: se crea `.screenshots/desktop.png`.

- [ ] **Step 3: Captura móvil (390×844, viewport tipo iPhone)**

Run:
```bash
chromium --headless=new --disable-gpu \
  --screenshot=$HOME/Proyectos/demo-dental-premium/.screenshots/mobile.png \
  --window-size=390,844 --virtual-time-budget=4000 \
  "https://charcoles-hub.github.io/demo-dental-premium/c/clinica-dental-aurora/"
```
Expected: se crea `.screenshots/mobile.png`.

- [ ] **Step 4: Verificar que ambos archivos existen y no están vacíos**

Run: `ls -la ~/Proyectos/demo-dental-premium/.screenshots/*.png`
Expected: ambos archivos listados con tamaño > 0 bytes (un PNG en blanco de error típicamente pesa unos pocos KB; una página real con contenido pesa más — revisar visualmente, no solo el tamaño).

- [ ] **Step 5: Commit del `.gitignore` actualizado**

```bash
git add .gitignore
git commit -m "Ignorar capturas de validación local"
```

- [ ] **Step 6: Presentar las capturas a Sergio para aprobación**

Mostrar `.screenshots/desktop.png` y `.screenshots/mobile.png` a Sergio. Este scaffold queda cerrado cuando confirme que ambas cargan correctamente (contenido del lead visible, sin errores de layout). El siguiente paso — diseño visual elaborado — lo ejecuta un agente aparte con `model: "fable"` sobre este mismo repo, no este plan.

---

## Self-Review

**Cobertura del spec:** datos de personalización (negocio/ciudad/telefono) → Task 2. Ruta estática real por lead → Task 2. Mismo stack de deploy que repos hermanos (Node 22, sin symlink `node_modules`, sin `pkill`) → Tasks 1 y 3, y constraint global. Repo nuevo separado → Task 3. Validación con capturas desktop+móvil antes de cerrar → Task 4. Pipeline masivo y diseño elaborado quedan explícitamente fuera (constraints globales) y delegados a trabajo posterior.

**Placeholders:** ninguno — todo paso de código lleva contenido completo y ejecutable.

**Consistencia de tipos:** `Lead` se define una sola vez en `src/data/leads.ts` (Task 2, Step 1) y se importa con ese mismo nombre en `src/pages/c/[slug].astro` (Task 2, Step 4). `Layout` recibe `{ title, description }` en su definición (Task 2, Step 3) y se invoca con esas mismas dos props en el Step 4. El slug `clinica-dental-aurora` es el mismo en los tests de Tasks 2, 3 y 4.
