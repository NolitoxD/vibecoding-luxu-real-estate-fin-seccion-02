# 🐛 Guía de Depuración — Luxe Estate

Documentación de configuración de depuración para este proyecto **Next.js 16 (App Router)** en VS Code.

---

## 📁 Archivos de configuración creados

```
.vscode/
├── launch.json   ← Configuraciones de depuración
└── tasks.json    ← Tarea para arrancar el servidor con inspector Node
docs/
└── DEBUG.md      ← Este archivo
```

---

## 📋 Datos del proyecto

| Dato | Valor |
|---|---|
| Gestor de paquetes | **npm** (`package-lock.json`) |
| Framework | **Next.js 16.1.6** (App Router) |
| Puerto dev por defecto | `http://localhost:3000` |
| TypeScript | ✅ con alias `@/*` → `./` |

---

## 🚀 Configuraciones de depuración (`launch.json`)

### 1. `Next.js: debug server-side` — Node Attach

> **Cuándo usarla:** Para depurar **Server Components, Route Handlers y Server Actions**.  
> Todo lo que NO tiene `"use client"` corre aquí (Node.js).

**Pasos:**

```bash
# 1. Arranca el servidor con el inspector Node activado
NODE_OPTIONS='--inspect' npm run dev

# 2. En VS Code: selecciona esta configuración y pulsa F5
```

VS Code se adjunta al proceso Node en el puerto `9229`.

---

### 2. `Next.js: debug client-side (Chrome / Edge)` — Chrome Launch

> **Cuándo usarla:** Para depurar **Client Components** (`"use client"`):  
> `SearchFilterModal.tsx`, `PropertyMapClient.tsx`, `PropertyCard.tsx`, `FavoriteButton.tsx`, etc.

**Pasos:**

```bash
# 1. Arranca el servidor normalmente (sin inspector)
npm run dev

# 2. En VS Code: selecciona esta configuración y pulsa F5
# → Abre Chrome/Edge en localhost:3000 con el debugger conectado
```

> ✅ Esta configuración es compatible también con la extensión **Microsoft Edge Tools for VS Code**.

---

### 3. `Next.js: debug client-side (Firefox)` — Firefox Launch

> **Cuándo usarla:** Igual que la anterior, pero usando **Firefox** como browser.

Requiere la extensión [Debugger for Firefox](https://marketplace.visualstudio.com/items?itemName=firefox-devtools.vscode-firefox-debug).

**Pasos:**

```bash
npm run dev
# Luego F5 con esta configuración seleccionada
```

> ⚠️ Para componentes con Leaflet (`PropertyMapClient.tsx`), preferir Chrome/Edge ya que Firefox puede ser inestable con los source maps de Web Workers.

---

### 4. `Next.js: debug full-stack` — Todo en uno ⭐

> **Cuándo usarla:** Uso diario. Arranca el servidor **y** abre Chrome en una sola acción.  
> Ideal cuando quieres poder poner breakpoints tanto en server como en client.

**Pasos:**

```bash
# Solo pulsa F5 con esta configuración — hace todo automáticamente
```

Lanza `next dev` directamente desde VS Code, espera a que el servidor esté listo (detecta `url: http://...` en la salida) y abre Chrome con el debugger conectado.

---

## ⚡ Flujo recomendado para el día a día

```
1. Abre el panel Run & Debug  →  Ctrl+Shift+D  (Mac: Cmd+Shift+D)
2. Selecciona "Next.js: debug full-stack"
3. Pulsa F5
4. Pon breakpoints en cualquier .tsx y recarga la página en el browser
```

---

## 🔌 Extensiones de VS Code necesarias

| Extensión | Necesaria para | Enlace |
|---|---|---|
| *(integrada en VS Code)* | Chrome / Edge (configs #2 y #4) | — |
| **Debugger for Firefox** | Config #3 (Firefox) | [Instalar](https://marketplace.visualstudio.com/items?itemName=firefox-devtools.vscode-firefox-debug) |
| **Microsoft Edge Tools** | Panel DevTools dentro de VS Code | [Instalar](https://marketplace.visualstudio.com/items?itemName=ms-edgedevtools.vscode-edge-devtools) |

---

## ⚠️ Problemas específicos de este repositorio

| Área | Estado | Detalle |
|---|---|---|
| **Source maps** | ✅ OK | Next.js 16 los genera automáticamente en dev. El override `webpack://_N_E/*` está configurado. |
| **App Router** | ⚠️ Importante | Server Components → config #1. Client Components → config #2/#3. No son intercambiables. |
| **`PropertyMapClient.tsx`** | ⚠️ Atención | Usa Leaflet. Breakpoints en callbacks del mapa pueden ser inestables en Firefox. Usar Chrome/Edge. |
| **`SearchFilterModal.tsx`** | ✅ OK | Client Component puro, breakpoints estables en cualquier config de browser. |
| **Alias `@/*`** | ✅ OK | `tsconfig.json` lo tiene configurado; Next.js lo resuelve correctamente en source maps. |
| **Variables de entorno** | ✅ OK | `.env` se carga automáticamente. `NEXT_PUBLIC_*` visibles en browser; el resto solo en Node. |

---

## 🗂️ Contenido de los archivos de configuración

### `.vscode/launch.json`

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "skipFiles": ["<node_internals>/**"],
      "sourceMaps": true
    },
    {
      "name": "Next.js: debug client-side (Chrome / Edge)",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}",
      "sourceMapPathOverrides": {
        "webpack://_N_E/*": "${workspaceFolder}/*"
      }
    },
    {
      "name": "Next.js: debug client-side (Firefox)",
      "type": "firefox",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}",
      "pathMappings": [
        {
          "url": "webpack://_N_E",
          "path": "${workspaceFolder}"
        }
      ]
    },
    {
      "name": "Next.js: debug full-stack",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"],
      "sourceMaps": true,
      "serverReadyAction": {
        "pattern": "started server on .+, url: (https?://.+)",
        "uriFormat": "%s",
        "action": "debugWithChrome"
      }
    }
  ]
}
```

### `.vscode/tasks.json`

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "next: dev (debug)",
      "type": "shell",
      "command": "npm run dev",
      "options": {
        "env": {
          "NODE_OPTIONS": "--inspect"
        }
      },
      "isBackground": true,
      "problemMatcher": {
        "owner": "next",
        "pattern": { "regexp": "." },
        "background": {
          "activeOnStart": true,
          "beginsPattern": "starting|compiling",
          "endsPattern": "ready|compiled|error"
        }
      },
      "group": {
        "kind": "build",
        "isDefault": true
      }
    }
  ]
}
```

---

*Generado el 16 de marzo de 2026 para el proyecto Luxe Estate.*
