# Buenas Prácticas y Recomendaciones para Real Estate en Next.js

## 1. Rendimiento y SEO 🚀

- **Next/Image obligatorio:** Para _lazy loading_ y compresión de imágenes pesadas (WebP/AVIF).
- **SSG + ISR:** Generación estática para páginas de detalles de las propiedades (carga ultrarrápida).
- **SSR:** Renderizado en el servidor para resultados de búsqueda y filtros.
- **Metadatos dinámicos:** Configurar etiquetas Open Graph y Twitter Cards por propiedad (clave para redes sociales).
- **Sitemap dinámico:** Para indexación instantánea de nuevos inmuebles en Google.

## 2. Arquitectura de Estado y Datos 🏢

- **Filtros en URL (Search Params):** Sincronizar todo estado de búsqueda con la URL (ej. `?precio=200000`) para poder compartir enlaces.
- **React Server Components (RSC):** Fetching de datos directo desde el servidor hacia la base de datos (menos JavaScript al cliente).
- **Paginación basada en URL:** Evitar consultas masivas a la DB segmentando resultados.
- **Scroll Infinito eficiente:** Uso de cursores y _virtualization_ si se prefiere scroll en listas largas de casas.

## 3. UI/UX (Experiencia de Usuario) ✨

- **Loading States (Skeletons):** Mostrar siluetas al cambiar vistas o aplicar mapas, para percepción de inmediatez.
- **Mapas interactivos (Mapbox/GMaps):** Pines dinámicos y _Clustering_ (agrupamiento de casas cercanas).
- **Navegación espacial:** Búsqueda en mapa sincronizada (_Bounding Box_); al mover el mapa se recargan los inmuebles listados.
- **Galerías multimedia premium:** Carruseles estables, modo pantalla completa interactivo y swipe en móvil.

## 4. Captación de Leads y Seguridad 🛡️

- **Server Actions:** Procesar todos los envíos de formularios ("Contactar", "Agendar visita") desde el servidor vía Next.js.
- **Validación de esquemas (Zod):** Datos del cliente estrictamente validados antes de insertar en la base de datos.
- **Protección Anti-Spam:** Uso de reCAPTCHA invisible o Turnstile en todos los formularios expuestos.
- **_remotePatterns_ estrictos:** Proteger el uso de imágenes externas (CDN/Supabase) limitando los dominios autorizados en `next.config.ts`.

## 5. Funcionalidades Recomendadas 💡

- **Calculadora de Hipotecas:** Embebida en cada ficha técnica, tomando el precio de dicha propiedad.
- **Guardar Favoritos:** Sistema de likes ("Wishlist") para usuarios registrados.
- **Tabla Comparadora:** Seleccionar casas y compararlas cara a cara (precio/m2, baños, etc.).
- **Tours 360:** Preparar iframes para vistas Matterport u otros renders 3D embebidos.
- **Alertas "Caída de precio":** Suscripciones para que el usuario reciba un email si la casa en la que está interesado baja de precio.

---

## 6. Escalabilidad y Mantenimiento 🛠️ _(Secundario pero vital a largo plazo)_

- **Manejo Global de Errores:** Implementar archivos `error.tsx` enrutados estratégicamente para que si falla la API de una casa, no se caiga todo el portal.
- **Componentes Modulares:** Separar estrictamente la UI sin estado (botones, inputs, _cards_) de los componentes que hacen _fetching_ o manejan servidor.
- **Analíticas Básicas y de Rendimiento:** Usar _Vercel Analytics_ (o similar) para chequear métricas Web Vitals, claves para posicionar un e-commerce o portal tan visual.

## 7. Internacionalización (i18n) 🌍

- **Soporte Multilingüe Ágil:** Usar el `app` router para traducir URLs de manera efectiva (`/es/comprar/casa`, `/en/buy/house`) si el público objetivo es extranjero (ej. zonas costeras).
- **Formato de Monedas Nativo:** Utilizar `Intl.NumberFormat` para pasar de Euros (€) a Dólares ($) o viceversa con el formato de millares correcto según el idioma.
- **Sistemas de Medición:** Dejar preparado un pequeño _toggle_ para alternar entre metros cuadrados (m²) y pies cuadrados (sq.ft).

## 8. Accesibilidad y Cumplimiento Legal ⚖️

- **Textos Alternativos (alt):** Cada imagen pesada debe tener un `alt` detallado (ej. "Fachada de chalet con piscina en Marbella"). Mejora masivamente el SEO para imágenes.
- **Contraste y Teclado:** Asegurar que los botones dorados/oscuros de contacto ("Call to Actions" típicos en inmobiliarias) superen pruebas de contraste WCAG y admitan el foco por teclado (`tab`).
- **Consentimientos Claros:** Como la captación de leads es el corazón del negocio del Real Estate, no saltarse los avisos legales (`GDPR/CCPA`) al lado del botón de enviar información.
