# 🟡 Caso 2 — Debug Client-Side (Chrome / Edge)

Guía paso a paso para probar la configuración `"Next.js: debug client-side (Chrome / Edge)"` de `launch.json`.

> **Antes de empezar:** Si el servidor de debug del Caso 1 sigue corriendo, para el debugger con  
> **Shift+F5** (o el botón ⏹ rojo de la barra). El servidor `npm run dev` puedes dejarlo corriendo  
> o pararlo — para este caso no hace falta que esté en modo `--inspect`.

---

## ¿Qué diferencia hay con el Caso 1?

| | Caso 1 (Node) | Caso 2 (Chrome/Edge) |
|---|---|---|
| **Dónde corre** | Servidor Node.js | Browser del usuario |
| **Qué debuggeas** | Server Components, Route Handlers | Client Components (`"use client"`) |
| **Inspector** | Node DevTools | Chrome DevTools |
| **Necesita `--inspect`** | ✅ Sí | ❌ No |

---

## ¿Qué vamos a depurar?

Este proyecto tiene dos Client Components perfectos para practicar:

| Archivo | Qué hace | Por qué es bueno para debug |
|---|---|---|
| `components/ui/FavoriteButton.tsx` | Toggle ❤️ favorito en cada propiedad | Pequeño, el estado cambia con un click, fácil de ver |
| `components/SearchFilterModal.tsx` | Modal de filtros de búsqueda | lógica `handleApplyFilters` construye la URL → ideal para ver estado en tiempo real |

> Para este ejercicio usamos **`FavoriteButton.tsx`** para el primer breakpoint (es muy directo)  
> y luego **`SearchFilterModal.tsx` línea 70** para ver algo más sustancioso.

---

## Paso 1 — Para el debug del Caso 1 (si está activo)

Si la barra naranja del debugger está visible en VS Code:

```
Shift+F5   ← detiene el debugger (NO para el servidor)
```

El servidor `npm run dev` puede seguir corriendo normalmente.

---

## Paso 2 — Asegúrate de que el servidor está corriendo

Si no tienes el servidor activo, ábrelo en modo **normal** (sin `--inspect`):

```bash
npm run dev
```

Confirma que `http://localhost:3000` carga bien en el browser.

---

## Paso 3 — Pon el breakpoint en FavoriteButton

Abre `components/ui/FavoriteButton.tsx` y haz clic en el margen de la **línea 18**:

```tsx
// línea 18 ← breakpoint aquí 🔴
setIsFavorite(!isFavorite);
```

Esta línea se ejecuta cada vez que el usuario hace click en el corazón de una propiedad.

---

## Paso 4 — Lanza el debugger Chrome/Edge

1. Abre **Run & Debug** → `Cmd+Shift+D`
2. Selecciona **"Next.js: debug client-side (Chrome / Edge)"**
3. Pulsa **F5**

VS Code abrirá una **ventana de Chrome dedicada** (no tu Chrome normal) en `http://localhost:3000`.  
En la barra inferior de VS Code aparecerá la barra naranja del debugger.

> ℹ️ Es importante usar **esa ventana de Chrome** que abrió VS Code, no otra.  
> Si la cierras, el debug se desconecta.

---

## Paso 5 — Dispara el breakpoint

En la ventana de Chrome que abrió VS Code:

1. Haz hover sobre cualquier tarjeta de propiedad
2. Haz **click en el icono de corazón** ❤️ (esquina superior derecha de la tarjeta)

VS Code pausa la ejecución inmediatamente.

---

## ¿Qué resultado esperas ver?

En cuanto hagas click en el corazón, **VS Code pausará en la línea 18** y verás:

| Panel | Qué muestra |
|---|---|
| **Editor** | Línea 18 resaltada en amarillo |
| **Variables → Local** | `isFavorite: false` (su valor actual ANTES del toggle) |
| **Variables → Local** | `e` → el evento del click (MouseEvent) |
| **Call Stack** | `onClick → FavoriteButton → React internals` |

Pulsa **F10** una vez — la línea se ejecuta y el estado cambia.  
Si ahora expandes `isFavorite` en Variables verás que es `true`.  
En Chrome, el corazón habrá cambiado a color relleno ❤️.

---

## Paso extra — Breakpoint en SearchFilterModal (más interesante)

Abre `components/SearchFilterModal.tsx` y pon un breakpoint en la **línea 70**:

```tsx
// línea 70 ← breakpoint aquí 🔴
const params = new URLSearchParams(searchParams.toString());
```

Esta es la función `handleApplyFilters`, que se ejecuta cuando el usuario pulsa **"Show Homes"**.

**Para dispararlo:**
1. En Chrome (la ventana de VS Code), haz click en el icono de filtros de la Navbar
2. Modifica algún filtro (p.ej. sube las habitaciones a 3)
3. Pulsa el botón **"Show Homes"** en el modal

VS Code pausa en la línea 70. Puedes inspeccionar:

```
Variables → Local:
  location     → ""                (o lo que hayas escrito)
  minPrice     → 0
  maxPrice     → 10000000
  beds         → 3                 ← el valor que pusiste
  baths        → 0
  propertyType → "Any Type"
  selectedAmenities → []
```

Avanza con **F10** línea a línea y observa cómo se construye el objeto `params`  
antes de que llegue a `router.push()` — ves exactamente qué URL se va a generar.

---

## ¿Cuándo usar esta configuración en el día a día?

Úsala cuando:
- Un **click, hover o evento** de UI no funciona como esperas
- El **estado de un componente** no se actualiza correctamente
- Quieres ver el valor exacto de las variables **antes** de que cambien
- Depuras lógica de **formularios o filtros** (como `handleApplyFilters`)
- Un **`useEffect`** se dispara de forma inesperada

---

## Controles del debugger (mismos que Caso 1)

| Tecla | Acción |
|---|---|
| **F10** | Siguiente línea (sin entrar en funciones) |
| **F11** | Entrar dentro de la función |
| **Shift+F11** | Salir de la función actual |
| **F5** | Continuar hasta el siguiente breakpoint |
| **Shift+F5** | Detener el debugger |

---

## Resumen del flujo

```
Servidor corriendo: npm run dev (sin --inspect)
    ↓
VS Code: selecciona "Next.js: debug client-side (Chrome / Edge)" → F5
    ↓
Chrome (ventana de VS Code): abre localhost:3000
    ↓
Click en el corazón ❤️ de cualquier propiedad
    ↓
VS Code pausa en línea 18 de FavoriteButton.tsx → inspeccionas estado
    ↓
F5 → Chrome actualiza el icono del corazón
```

---

## Archivos relacionados

- [`components/ui/FavoriteButton.tsx`](../components/ui/FavoriteButton.tsx) — Client Component del ejercicio principal
- [`components/SearchFilterModal.tsx`](../components/SearchFilterModal.tsx) — Client Component del ejercicio avanzado
- [`.vscode/launch.json`](../.vscode/launch.json) — Configuración de depuración
- [`DEBUG.md`](./DEBUG.md) — Documentación general de todas las configuraciones
- [`DEBUG-caso1-node-attach.md`](./DEBUG-caso1-node-attach.md) — Guía del Caso 1
