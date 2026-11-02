# SPEC-001 - Bento Grid del perfil

| Campo | Valor |
|---|---|
| Estado | Borrador |
| Feature | Dashboard principal (home) con tiles de perfil |
| Usuario principal | Visitante externo (reclutador, cliente, colega), mayormente en móvil |
| Depende de | `AGENTS.md`, skill `brand-design` |
| Relacionada | SPEC-002 (selector de idioma ES/EN) |

---

## 1. Definición del problema

**Situación.** Mi información profesional y personal está repartida: LinkedIn muestra el rol, Spotify muestra mis gustos, las fotos están en el celular, y mi trayectoria (docencia + desarrollo) no se entiende bien en un solo lugar. Quien me busca tiene que armar el rompecabezas, y la mayoría no lo hace.

**Problema.** Un visitante con poco tiempo no logra saber, en una sola vista, **quién soy, en qué me especializo, qué experiencia tengo, cómo soy como persona y cómo contactarme**.

**Usuario y necesidad.**
- *Reclutador/cliente:* quiere confirmar en menos de 10 segundos si encajo y llegar a mi LinkedIn.
- *Colega o curioso:* quiere conocerme un poco más allá del CV (música, series, hobbies, mascota).

**Resultado esperado.** Una sola pantalla, tipo dashboard, donde cada pedazo de mi identidad es un tile. Lo profesional está arriba y visible; lo personal da humanidad sin estorbar. Todo enlace externo está a un toque.

**Fuera de alcance de esta spec:** el selector de idioma (ver SPEC-002; aquí el contenido ya se modela como bilingüe), panel de edición (ver SPEC-003), backend, analytics, blog, formulario de contacto.

---

## 2. Diseño de la solución

### 2.1 Vista general

SPA de una sola ruta (`/`). La página pública renderiza el contenido publicado de `src/content/profile.ts`; el borrador del editor no se muestra en `/` (ver SPEC-003). Cabecera mínima (nombre + selector de idioma + botón de tema claro/oscuro) y debajo la cuadrícula de tiles. Los únicos "estados" de navegación son: tile expandido en un diálogo (Experiencia) y salida a enlaces externos en pestaña nueva.

### 2.2 Catálogo de tiles

**Obligatorios** (los pediste):

| `id` | Tipo | Contenido | Tamaño | Acción |
|---|---|---|---|---|
| `avatar` | `avatar` | Foto de perfil aislada del grid | Mediana (128 px móvil, 160 px desktop), circular | Ninguna |
| `identity` | `identity` | Nombre, headline y bio de 1–2 líneas | 1×1 | Ninguna |
| `specialty` | `specialty` | Especialidad, chips de stack y enlace al portafolio | 2×1 | Enlace externo al portafolio (opcional) |
| `experience` | `experience` | Resumen de trayectoria (3 hitos máx.) | 2×1 | Abre diálogo con la trayectoria completa |
| `linkedin` | `link` | Marca LinkedIn + CTA | 1×1 | Enlace externo |
| `spotify` | `spotify` | Playlist favorita | 2×1 | Carga el reproductor bajo demanda; fallback a enlace |
| `pet` | `photo` | Foto con algo especial (mascota) + pie de foto | 1×2 | Ninguna |
| `series` | `top-list` | 3 series favoritas, numeradas | 1×1 | Ninguna |
| `hobbies` | `hobbies` | 2 hobbies con ícono | 1×1 | Ninguna |

El `avatar` es el único tile que no vive dentro del grid: se renderiza antes de la cuadrícula, centrado en móvil y alineado a la izquierda en desktop. Los otros 8 tiles obligatorios forman el grid.

**Sugeridos** (opcionales, se activan con `enabled: true`; el usuario decide):

| `id` | `type` | Contenido | Tamaño | Acción |
|---|---|---|---|---|
| `projects` | `projects` | 1–2 proyectos con resumen y enlace (prueba concreta de lo que hago) | 2×1 | Enlace externo |
| `github` | `link` | Marca GitHub + CTA | 1×1 | Enlace externo |
| `contact` | `contact` | CTA principal de correo | 1×1 | `mailto:` |
| `now` | `now` | "Ahora estoy…" (estudio, proyecto, ciudad); muestra que sigo avanzando | 1×1 | Ninguna |
| `availability` | `availability` | Zona horaria y disponibilidad remoto/freelance | 1×1 | Ninguna |

Los sugeridos se implementan con la misma unión `Tile`; no hay tipos "especiales" fuera de ella. Si activas uno, sus campos obligatorios también deben existir en ambos idiomas.

### 2.3 Modelo de datos (`src/content/profile.types.ts`)

```ts
import type { Localized } from '@/shared/i18n/types'; // Localized<T> = { es: T; en: T }

export type TileSize = '1x1' | '2x1' | '1x2' | '2x2';

interface BaseTile {
  id: string;
  enabled: boolean;
  // El orden es el del array `tiles`; no hay campo `order`.
}

interface GridTile extends BaseTile {
  size: TileSize;
}

// Nombres propios (series, tecnologías, empresas) son string; el texto libre es Localized.
export type LinkPlatform = 'linkedin' | 'github' | 'x' | 'email' | 'other';

export type Tile =
  | (BaseTile & { type: 'avatar'; image: ImageRef })
  | (GridTile & { type: 'identity'; name: string; headline: Localized; bio: Localized })
  | (GridTile & { type: 'specialty'; title: Localized; chips: string[]; portfolio?: { label: Localized; href: string } })
  | (GridTile & { type: 'experience'; summary: Milestone[]; timeline: Milestone[] })
  | (GridTile & { type: 'link'; platform: LinkPlatform; label: string; handle: string; href: string })
  | (GridTile & { type: 'spotify'; title: Localized; playlistId: string; href: string })
  | (GridTile & { type: 'photo'; image: ImageRef; caption: Localized })
  | (GridTile & { type: 'top-list'; title: Localized; items: [string, string, string] })
  | (GridTile & { type: 'hobbies'; title: Localized; items: [Hobby, Hobby] })
  | (GridTile & { type: 'projects'; title: Localized; items: ProjectItem[] })
  | (GridTile & { type: 'contact'; title: Localized; email: string; href: string })
  | (GridTile & { type: 'now'; title: Localized; body: Localized })
  | (GridTile & { type: 'availability'; title: Localized; timezone: string; modes: Localized[] });

export interface ImageRef { src: string; alt: Localized; width: number; height: number }
export interface Milestone { period: string; role: Localized; place: string; detail?: Localized }
export interface Hobby { label: Localized; icon: string }
export interface ProjectItem { name: string; summary: Localized; href?: string }

export interface BentoDocument {
  version: 1;
  tiles: Tile[];
}
```

`profile.ts` exporta `const profile = { version: 1, tiles } satisfies BentoDocument`. `ProfileGrid` filtra `enabled`, separa el `avatar` del resto, respeta el orden del array, resuelve cada `Localized` al idioma activo y renderiza cada tile con su componente según `type`. Los tiles reciben textos ya resueltos.

El editor local (SPEC-003) usa exactamente `BentoDocument`; el orden del array es la única fuente del orden visual. Editar, reordenar o redimensionar actualiza ese mismo modelo, pero el `avatar` no se redimensiona ni entra al grid.

### 2.4 Layout y responsive

Enfoque **mobile-first** (se espera que la mayoría de visitas llegue desde el celular). Breakpoints por defecto de Tailwind (`sm` 640, `lg` 1024).

| Rango | Columnas | Contenedor | Notas |
|---|---|---|---|
| 320–639 px | 1 | Fluido, padding lateral 16 px | Tiles a ancho completo; orden = orden del array |
| 640–1023 px | 2 | Fluido, padding lateral 24 px | `2x…` ocupa el ancho completo; `1x2` conserva 2 filas |
| 1024–1439 px | 4 | Máx. 1120 px, centrado | Spans según `size` |
| ≥ 1440 px | 4 | Máx. 1120 px, centrado | No se estira; márgenes laterales crecen |

Reglas de diseño responsive:

- **Avatar:** antes del grid, circular, 128 px en móvil y 160 px desde `sm`; centrado en móvil y alineado a la izquierda en desktop.
- **Orden móvil:** `identity`, `linkedin`, `specialty`, `experience`, `spotify`, `pet`, `series`, `hobbies`, y después los sugeridos. Así, en un móvil de 390×844 px, quien llega ve el avatar, quién soy y el enlace a LinkedIn sin hacer scroll.
- **Tipografía fluida** para el nombre del hero (`clamp()`); el resto sigue la escala de la skill `brand-design`.
- **Alturas flexibles:** `min-h` en tiles, nunca `h-*` fija; tolera textos más largos (el español ≈ +30 % frente al inglés) y zoom de texto al 200 %.
- **Reflow:** a 320 px de ancho (equivale a 400 % de zoom en una pantalla de 1280 px) no hay scroll horizontal ni pérdida de contenido.
- **Orientación horizontal en móvil** (≈ 844×390): 2 columnas y ningún elemento fijo que tape contenido.
- **Áreas seguras:** cabecera y pie respetan `env(safe-area-inset-*)`.
- **Zoom:** la meta `viewport` no desactiva el zoom del usuario (`user-scalable=no` está prohibido).
- Anchos de prueba: 320, 360, 390, 768, 1024, 1280 y 1920 px.

### 2.5 Comportamiento

- **Avatar:** se renderiza como `<figure>` fuera del grid, con la imagen prioritaria y fallback de iniciales. Si falta, está deshabilitado o es inválido, no se muestra y el grid empieza directamente.
- **Tile de enlace** (`link`, `contact`): todo el tile es un `<a>`. Los enlaces `http(s)` externos usan `target="_blank"` y `rel="noopener noreferrer"`; los `mailto:` no abren pestaña nueva. Los `href` solo aceptan `http(s)` o `mailto:`; un `href` inválido o con esquema `javascript:`/`data:` invalida el tile y se avisa en desarrollo.
- **Portafolio en Especialidad:** si `specialty.portfolio` existe, el tile muestra un enlace externo con etiqueta bilingüe y objetivo táctil ≥ 44 px, además de los chips. Usa `target="_blank"` y `rel="noopener noreferrer"`; si falta la etiqueta en un idioma o el `href` es inseguro, el tile se omite.
- **Spotify (patrón fachada):** al cargar se muestra una tarjeta estática con título, portada y botón "Reproducir aquí". El `<iframe>` de `open.spotify.com/embed/...` se crea solo tras ese clic. Debajo, siempre visible, el enlace "Abrir en Spotify". Si el iframe falla, queda el enlace.
- **Experiencia:** el tile es un `<button>`; abre un diálogo modal con la trayectoria completa. Cierra con Esc, clic fuera o botón visible; devuelve el foco al tile.
- **Tema:** por defecto sigue `prefers-color-scheme`; el botón de cabecera alterna y persiste la elección.
- **Idioma:** lo gobierna SPEC-002; el selector vive en la cabecera junto al botón de tema.
- **Datos faltantes:** un tile sin campos obligatorios no se renderiza y se avisa por `console.warn` en desarrollo; la página nunca se rompe.
- **Imagen que no carga:** se muestra un placeholder con iniciales y el layout no salta.

### 2.6 Accesibilidad, UX y rendimiento (requisitos transversales)

- WCAG 2.2 AA como piso.
- Cada tile del grid es un `<article>` con encabezado propio; el avatar es un `<figure>` independiente. El orden de lectura coincide con el orden visual móvil.
- Objetivos táctiles ≥ 44×44 px (más estricto que el mínimo AA de WCAG 2.2, que es 24 px) y separación ≥ 8 px entre objetivos contiguos.
- Contraste de texto ≥ 4.5:1; de bordes de componentes interactivos y anillo de foco ≥ 3:1. Foco visible en todo elemento interactivo.
- Feedback visual a toda interacción en ≤ 100 ms; respeta `prefers-reduced-motion`.
- Imágenes con `width`/`height`; solo el `avatar` con `fetchpriority="high"`, el resto `loading="lazy"`. Preferir `.webp`; el JPG/PNG actual se optimiza antes del deploy final.
- Sin scripts de terceros en la carga inicial.
- Presupuesto de rendimiento: LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms (umbrales "buenos" de Core Web Vitals) y JS inicial ≤ 150 KB gzip.

---

## 3. Criterios de aceptación

Cada criterio es verificable por una prueba automática o un chequeo concreto.

| # | Criterio | Cómo se verifica |
|---|---|---|
| **AC-1** | Con un `profile.ts` válido que incluye el `avatar` y los 8 tiles obligatorios del grid con `enabled: true`, la home renderiza el avatar en un `<figure data-profile-avatar>` fuera del grid y exactamente un `<article data-tile-id>` por cada tile habilitado del grid. Un tile con `enabled: false` no aparece. Ningún texto, URL o imagen está hardcodeado fuera de `profile.ts`. | Vitest + RTL con un fixture de tiles: contar `article[data-tile-id]`, comparar ids, comprobar que el avatar no tiene un `article` ancestro y que precede al grid. Búsqueda en `src/features` y `src/shared` de cadenas de contenido: 0 coincidencias. |
| **AC-2** | La cuadrícula usa 1 columna a 320, 360 y 390 px, 2 columnas a 768 px y 4 columnas a 1024, 1280 y 1920 px (contenedor ≤ 1120 px). No hay scroll horizontal ni celdas vacías en los anchos de 2 y 4 columnas. El avatar es circular, mide entre 128 y 160 px y queda fuera del grid. A 390×844 px el avatar, el tile `identity` y el enlace de LinkedIn están completamente visibles sin hacer scroll. Todo elemento interactivo mide al menos 44×44 px. | Playwright en los 7 viewports (320, 360, 390, 768, 1024, 1280, 1920): `grid-template-columns` computado, `scrollWidth <= clientWidth`, mapa de celdas ocupadas, `boundingBox()` y radio computado del avatar, `boundingBox()` de avatar, `identity` y el enlace de LinkedIn dentro del viewport inicial (390×844), y `boundingBox()` ≥ 44×44 para cada `a`, `button`. |
| **AC-3** | Los enlaces externos `http(s)` (LinkedIn, el portafolio de Especialidad y los sugeridos activos) son elementos `<a>` con `href` correcto, `target="_blank"`, `rel` que incluye `noopener` y `noreferrer`, nombre accesible no vacío, y se activan con Enter por teclado. El tile `contact` usa `mailto:` y no abre pestaña nueva. | RTL: consultar `role="link"` y sus atributos. Playwright: `focus()` + `Enter` abre una página nueva con la URL esperada; `mailto:` conserva el `href` y no usa `target="_blank"`. |
| **AC-4** | Al cargar la página no se solicita nada a `open.spotify.com`. Tras pulsar "Reproducir aquí" aparece un único `<iframe>` con la playlist configurada. El enlace "Abrir en Spotify" está presente antes y después del clic. | Playwright: registrar peticiones de red; aserción de 0 peticiones a `open.spotify.com` en carga; tras el clic, 1 iframe con `src` que contiene `playlistId`. |
| **AC-5** | Al activar el tile de Experiencia se abre un elemento `role="dialog"` con `aria-modal="true"` que muestra la trayectoria completa; el foco entra al diálogo, el foco no escapa mientras está abierto, Esc lo cierra y el foco regresa al tile que lo abrió. | Playwright: abrir con teclado, comprobar `document.activeElement` dentro del diálogo, pulsar Tab varias veces, pulsar Esc y comprobar el foco de retorno. |
| **AC-6** | En tema claro y en tema oscuro hay 0 violaciones axe de impacto `serious` o `critical`; todas las imágenes tienen `alt` no vacío (salvo decorativas con `alt=""`); el botón de tema cambia `data-theme` en `<html>` y la elección sobrevive a una recarga. | `@axe-core/playwright` en ambos temas; Playwright: clic en el botón, leer `data-theme`, recargar y releer. |
| **AC-7** | En el build de producción, Lighthouse móvil da Performance ≥ 90, Accessibility ≥ 95 y Best Practices ≥ 95, con LCP ≤ 2.5 s, CLS ≤ 0.1 y TBT ≤ 200 ms (proxy de laboratorio de INP); el JS inicial no supera 150 KB gzip. | Lighthouse CI (o corrida manual documentada) sobre `npm run build` servido localmente; tamaño del bundle con el reporte del build o `size-limit`. |

---

## 4. Notas para el plan de implementación

Orden sugerido (cada paso cierra uno o más criterios):

1. Tipos y `profile.ts` con el avatar y los 8 tiles del grid → AC-1
2. `ProfileGrid` + avatar fuera del grid + mapa de tamaños + tokens de marca → AC-1, AC-2
3. Tiles de enlace → AC-3
4. Tile de Spotify con fachada → AC-4
5. Diálogo de Experiencia → AC-5
6. Tema claro/oscuro + pasada de accesibilidad → AC-6
7. Optimización de imágenes y medición → AC-7
8. Después, SPEC-002 (idioma ES/EN). Los tipos `Localized` se usan desde el paso 1 para no migrar luego
9. Después, SPEC-003 (editor local). Reutiliza el modelo, el grid y los tiles de esta spec; no los duplica
