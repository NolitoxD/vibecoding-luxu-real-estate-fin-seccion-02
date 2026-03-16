# 🟢 Caso 1 — Debug Server-Side (Node Attach)

Guía paso a paso para probar la configuración `"Next.js: debug server-side"` de `launch.json`.

---

## ¿Qué vamos a depurar?

Esta configuración sirve para todo lo que corre en **Node.js** (servidor), es decir, archivos sin `"use client"`.

Los dos targets más claros en este proyecto son:

| Archivo | Por qué es server-side |
|---|---|
| `app/page.tsx` | Sin `"use client"` → corre en Node. Hace la query principal a Supabase |
| `app/api/properties/route.ts` | Route Handler → siempre Node. Lo llama el infinite scroll |

> Para este ejercicio usamos **`app/api/properties/route.ts`** porque es el más fácil de disparar (una simple URL en el browser) y el resultado es inmediato y claro.

---

## Paso 1 — Pon el breakpoint ANTES de arrancar

Abre `app/api/properties/route.ts` y haz clic en el **margen izquierdo** de la línea 5:

```ts
// línea 5 ← pon el breakpoint aquí 🔴
const { searchParams } = new URL(request.url);
```

Verás un punto rojo en el margen. Ese es tu breakpoint.

---

## Paso 2 — Arranca el servidor con inspector Node

En el terminal integrado de VS Code (`Ctrl+\``) ejecuta:

```bash
NODE_OPTIONS='--inspect' npm run dev
```

Deberías ver esto en la consola:

```
Debugger listening on ws://127.0.0.1:9229/...
For help, see: https://nodejs.org/en/docs/inspector
▲ Next.js 16.1.6
- Local: http://localhost:3000
```

> ⚠️ La línea `Debugger listening on ws://127.0.0.1:9229` es la confirmación de que Node está escuchando.  
> Si no aparece, el inspector no está activo y VS Code no podrá adjuntarse.

---

## Paso 3 — Adjunta VS Code al proceso

1. Abre el panel **Run & Debug** → `Cmd+Shift+D`
2. Selecciona **"Next.js: debug server-side"** en el desplegable
3. Pulsa **F5**

La barra inferior de VS Code se pondrá **naranja** y aparecerá la barra de herramientas del debugger en la parte superior.

---

## Paso 4 — Dispara la petición

Abre el browser y ve a esta URL:

```
http://localhost:3000/api/properties?from=0&to=3
```

Eso es suficiente para disparar el Route Handler.

---

## ¿Qué resultado esperas ver?

En cuanto el browser envíe la petición, **VS Code pausará la ejecución en la línea 5** y verás:

| Panel | Qué muestra |
|---|---|
| **Editor** | La línea resaltada en amarillo — ahí está parada la ejecución |
| **Variables** (izquierda) | El objeto `request` con todos los datos de la petición HTTP |
| **Watch** | Puedes añadir expresiones como `searchParams.get('from')` |
| **Call Stack** | La pila de llamadas de Next.js que llevó hasta tu función |

---

## Controles del debugger

| Tecla | Acción |
|---|---|
| **F10** | Siguiente línea (sin entrar en funciones internas) |
| **F11** | Entrar dentro de la siguiente función |
| **Shift+F11** | Salir de la función actual |
| **F5** | Continuar hasta el siguiente breakpoint |
| **Shift+F5** | Detener el debugger |

---

## El momento más útil del ejercicio

Cuando llegues a la **línea 50**:

```ts
const { data, count, error } = await query
  .order("created_at", { ascending: false })
  .range(from, to);
```

Después de pulsar **F10** para ejecutarla, expande la variable `data` en el panel Variables. Verás los registros que devuelve Supabase **antes de que se serialicen como JSON** — eso es el valor real del debug server-side: inspeccionar datos que nunca llegan al browser.

---

## Resumen del flujo

```
Terminal: NODE_OPTIONS='--inspect' npm run dev
    ↓
VS Code: selecciona "Next.js: debug server-side" → F5
    ↓
Browser: visita http://localhost:3000/api/properties?from=0&to=3
    ↓
VS Code pausa en el breakpoint → inspeccionas variables
    ↓
F5 para continuar → el browser recibe la respuesta JSON
```

---

## Archivos relacionados

- [`app/api/properties/route.ts`](../app/api/properties/route.ts) — Route Handler usado en este ejemplo
- [`app/page.tsx`](../app/page.tsx) — Server Component alternativo para practicar
- [`.vscode/launch.json`](../.vscode/launch.json) — Configuración de depuración
- [`.vscode/tasks.json`](../.vscode/tasks.json) — Tarea que inyecta `NODE_OPTIONS=--inspect`
- [`DEBUG.md`](./DEBUG.md) — Documentación general de todas las configuraciones
