# 🟠 Caso 3 — Debug Client-Side (Firefox)

Guía paso a paso para probar la configuración `"Next.js: debug client-side (Firefox)"` de `launch.json`.

---

## ¿Qué diferencia hay con el Caso 2 (Edge)?

| | Caso 2 (Edge) | Caso 3 (Firefox) |
|---|---|---|
| **Extensión VS Code** | Integrada (no instalar) | `firefox-devtools.vscode-firefox-debug` |
| **Tipo en launch.json** | `msedge` | `firefox` |
| **Source maps** | `sourceMapPathOverrides` | `pathMappings` |
| **Caveat con Leaflet** | ✅ Estable | ⚠️ Puede ser inestable en Web Workers |
| **DevTools embebidas** | ✅ (Edge Tools extension) | ❌ (abre las DevTools de Firefox en su propia ventana) |

La lógica de depuración es idéntica — la diferencia está en el motor del browser.

---

## Requisito previo

Extensión instalada en VS Code:

```
Cmd+Shift+X → "Debugger for Firefox"
ID: firefox-devtools.vscode-firefox-debug
```

---

## Configuración en launch.json

```json
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
}
```

> **Nota:** Firefox usa `pathMappings` en lugar de `sourceMapPathOverrides` (que usa Chrome/Edge).  
> El prefijo de source maps es el mismo: `webpack://_N_E`.

---

## Paso 1 — Para cualquier debugger activo

Si tienes Edge u otra sesión activa:

```
Shift+F5  →  detiene el debugger actual
```

El servidor `npm run dev` se queda corriendo, no lo pares.

---

## Paso 2 — Pon el breakpoint

Abre `components/ui/FavoriteButton.tsx` y haz click en el margen de la **línea 18**:

```tsx
// línea 18 ← breakpoint aquí 🔴
setIsFavorite(!isFavorite);
```

---

## Paso 3 — Lanza el debugger Firefox

1. **Run & Debug** → `Cmd+Shift+D`
2. Selecciona **"Next.js: debug client-side (Firefox)"**
3. Pulsa **F5**

Firefox abrirá una ventana nueva dedicada al debug en `http://localhost:3000`.

> ⚠️ Firefox abre su propia ventana separada — no usa las DevTools embebidas en VS Code  
> como hace Edge Tools. Los breakpoints siguen funcionando desde VS Code, pero el browser  
> es una ventana de Firefox independiente.

---

## Paso 4 — Dispara el breakpoint

En la ventana de Firefox que abrió VS Code:

1. Haz hover sobre cualquier tarjeta de propiedad
2. Haz **click en el icono de corazón** ❤️

VS Code pausa la ejecución en la línea 18.

---

## ¿Qué resultado esperas ver?

Idéntico al Caso 2 con Edge:

| Panel | Qué muestra |
|---|---|
| **Editor** | Línea 18 resaltada en amarillo |
| **Variables → Local** | `isFavorite: false` (valor antes del toggle) |
| **Variables → Local** | `e` → `SyntheticBaseEvent` del click |
| **Call Stack** | `onClick → FavoriteButton → React internals` |

---

## Advertencia específica: Leaflet y Web Workers

`components/PropertyMapClient.tsx` usa **Leaflet**, que crea Web Workers internamente.  
Firefox puede tener problemas para vincular breakpoints dentro de callbacks del mapa porque  
los source maps de los Workers no siempre se resuelven correctamente.

**Regla práctica:**
- Depurar lógica de UI (filtros, estado, navegación) → ✅ Firefox funciona bien  
- Depurar el mapa Leaflet → ⚠️ Usar Edge (Caso 2) para mayor estabilidad

---

## Paso extra — SearchFilterModal (igual que Caso 2)

Pon un breakpoint en `components/SearchFilterModal.tsx` **línea 70**:

```tsx
// línea 70 ← breakpoint aquí 🔴
const params = new URLSearchParams(searchParams.toString());
```

Abre el modal de filtros → modifica algo → pulsa **"Show Homes"**.  
VS Code pausa y puedes inspeccionar todos los estados de los filtros antes de que  
se construya la URL y se llame a `router.push()`.

---

## ¿Cuándo usar Firefox en lugar de Edge?

- Cuando necesitas **verificar compatibilidad cross-browser** (asegurarte de que algo funciona igual en Firefox y en Chromium)
- Cuando el usuario final usa Firefox y reporta un bug específico
- Para validar que los **estilos CSS** se renderizan igual en ambos motores

---

## Controles del debugger

| Tecla | Acción |
|---|---|
| **F10** | Siguiente línea |
| **F11** | Entrar en función |
| **Shift+F11** | Salir de función |
| **F5** | Continuar |
| **Shift+F5** | Detener debugger |

---

## Resumen del flujo

```
Servidor corriendo: npm run dev (sin --inspect)
    ↓
VS Code: selecciona "Next.js: debug client-side (Firefox)" → F5
    ↓
Firefox (ventana nueva): abre localhost:3000
    ↓
Click en el corazón ❤️ de cualquier propiedad
    ↓
VS Code pausa en línea 18 de FavoriteButton.tsx
    ↓
F5 → Firefox actualiza el icono del corazón
```

---

## Archivos relacionados

- [`components/ui/FavoriteButton.tsx`](../components/ui/FavoriteButton.tsx) — Client Component del ejercicio
- [`components/SearchFilterModal.tsx`](../components/SearchFilterModal.tsx) — Ejercicio avanzado
- [`components/PropertyMapClient.tsx`](../components/PropertyMapClient.tsx) — ⚠️ Preferir Edge para este
- [`.vscode/launch.json`](../.vscode/launch.json) — Configuración de depuración
- [`DEBUG.md`](./DEBUG.md) — Documentación general
- [`DEBUG-caso2-chrome-edge.md`](./DEBUG-caso2-chrome-edge.md) — Guía del Caso 2
