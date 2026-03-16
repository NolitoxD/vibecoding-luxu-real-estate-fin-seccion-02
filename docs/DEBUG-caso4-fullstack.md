# 🟣 Caso 4 — Debug Full-Stack (Server + Client)

Guía paso a paso para probar la configuración `"Next.js: debug full-stack (sin Turbopack)"` de `launch.json`.

---

## ¿Por qué es la mejor configuración?

Esta configuración es la "bala de plata" para el desarrollo diario porque **hace todo a la vez:**

1. Arranca el servidor de Node **con el inspector activado** automáticamente.
2. Usa `--webpack` en lugar de Turbopack para garantizar que los **Source Maps sean 100% fiables**.
3. Espera a que Next.js compile y **abre Chrome/Edge automáticamente**.
4. Te permite depurar **Server Components y Client Components** en la misma sesión.

No tienes que ejecutar comandos manuales en la terminal; solo pulsar F5 y VS Code se encarga del resto.

---

## Paso 1 — Para todo lo que tengas corriendo

Para evitar conflictos de puertos, asegúrate de que **ningún servidor Next.js esté corriendo.**

1. En la terminal de VS Code, si tienes `npm run dev` o `npm run dev:debug` corriendo, pulsa **Ctrl+C** para pararlo.
2. Si tienes barras naranjas de debug activas, pulsa **Shift+F5** para cerrarlas.

---

## Paso 2 — Prepara tus breakpoints (Client + Server)

Vamos a poner dos breakpoints para demostrar el poder del Full-Stack:

**1. Breakpoint en el Servidor (Node):**
Abre `app/api/properties/route.ts` y haz click en el margen izquierdo de la **línea 5**:
```typescript
// línea 5 ← 🔴 Breakpoint aquí
const { searchParams } = new URL(request.url);
```

**2. Breakpoint en el Cliente (Browser):**
Abre `components/ui/FavoriteButton.tsx` y haz click en el margen izquierdo de la **línea 18**:
```tsx
// línea 18 ← 🔴 Breakpoint aquí
setIsFavorite(!isFavorite);
```

---

## Paso 3 — Lanza la depuración mágica

1. Abre el panel **Run & Debug** → `Cmd+Shift+D`
2. En el desplegable, selecciona **"Next.js: debug full-stack (sin Turbopack)"**
3. Pulsa **F5**

**¿Qué va a pasar ahora en orden automático?**
1. Se abrirá la **Debug Console** de VS Code mostrando cómo se levanta el servidor.
2. Tardará un par de segundos más que Turbopack (porque usa Webpack).
3. Cuando compile en verde, **VS Code abrirá Google Chrome automáticamente** (con un proceso limpio para debug).

---

## Paso 4 — Dispara los breakpoints

### Prueba 1: Petición al Servidor (API)
En la misma ventana de Chrome que se ha abierto, ve a la siguiente URL:
`http://localhost:3000/api/properties?from=0&to=3`

👉 **Resultado:** VS Code deberá detenerse inmediatamente en la **línea 5** de tu Route Handler. ¡Estás depurando Node!  
*(Pulsa la tecla de "Play" azul o F5 para que la petición termine).*

### Prueba 2: Interacción de Cliente (React)
Vuelve atrás en Chrome para estar en la página principal (`http://localhost:3000`).
Haz hover sobre cualquier propiedad y **pulsa el corazón de Favorito (❤️)**.

👉 **Resultado:** VS Code deberá detenerse en la **línea 18** de `FavoriteButton.tsx`. ¡Estás depurando React en el browser!  
*(Pulsa la tecla de "Play" azul o F5 para soltarlo).*

---

## Fallos comunes

*   **"Unable to open browser" / Error de Chrome:** Si te sale algún diálogo rojo de VS Code al hacer F5, simplemente pulsa **"Debug Anyway"** (suele ocurrir si Chrome se quedó cerrado abruptamente la última vez).
*   **"Port 9229 in use" u otros de puertos:** Recuerda el Paso 1. Cierra procesos en la terminal (`Ctrl+C`) antes de lanzar el Full Stack.

---

## Resumen

Esta configuración es todo lo que necesitas lanzar por las mañanas. Controla el frontend, el backend y el navegador de un solo plumazo. 🚀
