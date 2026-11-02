# Bento personal — Nestor Rivas

> Tarjeta de presentación personal en formato dashboard: una cuadrícula de tiles con perfil, especialidad, trayectoria, enlaces, música, series, hobbies y mascota. Bilingüe ES/EN, responsive y sin backend.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/badge/Tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/badge/E2E-Playwright-2EAD33?logo=playwright&logoColor=white)

**Estado:** prototipo funcional con contenido real e imágenes WebP. El código está publicado en [rotsenk/benbento](https://github.com/rotsenk/benbento); quedan demo publicada, licencia y editor local. Consulta [PROJECT_STATUS.md](./PROJECT_STATUS.md) para el detalle completo.

---

## Contenido

- [Qué es](#qué-es)
- [Características](#características)
- [Stack](#stack)
- [Requisitos](#requisitos)
- [Inicio rápido](#inicio-rápido)
- [Scripts](#scripts)
- [Contenido y edición](#contenido-y-edición)
- [Idioma, tema y URL](#idioma-tema-y-url)
- [Arquitectura](#arquitectura)
- [Testing y calidad](#testing-y-calidad)
- [Rendimiento](#rendimiento)
- [Build y deploy](#build-y-deploy)
- [Roadmap](#roadmap)
- [Documentación](#documentación)

---

## Qué es

Una SPA de una sola página pensada para que un reclutador, cliente o colega entienda en segundos quién soy, en qué trabajo y cómo contactarme. Lo profesional aparece primero; lo personal —música, series, hobbies, mascota— da contexto sin competir con lo importante.

La página pública vive en `/`. El contenido se publica desde un archivo TypeScript tipado (`src/content/profile.ts`) y se renderiza como un grid de tiles. No hay login, base de datos, CMS ni llamadas a APIs propias.

## Características

- **Grid responsive mobile-first:** 1 columna en móvil, 2 en tablet y 4 en desktop, con layout compacto y sin huecos.
- **Avatar + 8 tiles publicados:** foto de perfil circular fuera del grid; identidad, LinkedIn, especialidad con enlace al portafolio, experiencia, Spotify, mascota, series y hobbies dentro.
- **5 tiles sugeridos listos para activar:** proyectos, GitHub, contacto, “ahora” y disponibilidad.
- **Bilingüe ES/EN:** contenido y textos de interfaz resueltos en el cliente, con preferencia persistente y enlace compartible mediante `?lang=`.
- **Tema claro, oscuro y sistema:** persistencia local y respeto por `prefers-color-scheme`.
- **Accesibilidad:** HTML semántico, foco visible, objetivos táctiles de 44×44 px, diálogo con manejo de foco, región `aria-live` y `prefers-reduced-motion`.
- **Spotify bajo demanda:** sin iframe ni peticiones a Spotify hasta que la persona pulsa “Reproducir aquí”.
- **Rendimiento cuidado:** fuentes autoalojadas con subconjuntos latin/latin-ext, imágenes con dimensiones, precarga de la foto principal y chunks separados.
- **Contenido tolerante a fallos:** los tiles incompletos se omiten en desarrollo con un aviso, sin romper la página.
- **Tiles de enlace seguros:** solo se aceptan `http(s)` y `mailto:`; se rechazan `javascript:` y `data:`.

## Stack

| Capa | Tecnología |
|---|---|
| UI | React 18 + TypeScript estricto |
| Build | Vite 8 |
| Estilos | Tailwind CSS 4 + tokens de marca en `src/index.css` |
| Estado de UI | Redux Toolkit (`theme`, `locale`, `activeDialog`) |
| Documento del perfil | Context + `useReducer` en `ProfileProvider` |
| Iconos | `@phosphor-icons/react` |
| Fuentes | `@fontsource` (Space Grotesk, Inter, JetBrains Mono) |
| Tests unitarios | Vitest + React Testing Library |
| E2E | Playwright + `@axe-core/playwright` |
| Calidad | ESLint + Prettier |

## Requisitos

- **Node.js 22.12 o superior.** Probado con Node 24.19.
- npm 11 o superior.
- Para E2E: navegadores de Playwright (`chromium` y `webkit`).

## Inicio rápido

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

Para ejecutar la suite E2E por primera vez:

```bash
npx playwright install chromium webkit
npm run build
npm run e2e
```

`npm run e2e` levanta un preview del build existente. Si cambiaste código, ejecuta `npm run build` antes.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR. |
| `npm run build` | Typecheck + build de producción en `dist/`. |
| `npm run preview` | Sirve `dist/` localmente en el puerto 4173. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm run lint` | ESLint sin warnings permitidos. |
| `npm run test` | Tests unitarios y de componentes con Vitest. |
| `npm run e2e` | Playwright sobre Chromium y WebKit móvil. Requiere build previo. |

## Contenido y edición

### Archivos que importan

| Archivo | Responsabilidad |
|---|---|
| `src/content/profile.ts` | Contenido publicable: textos, URLs, imágenes, tamaños y visibilidad de cada tile. |
| `src/content/profile.types.ts` | Modelo `BentoDocument`, unión `Tile` y tipos auxiliares. |
| `src/content/ui.ts` | Textos de interfaz, etiquetas accesibles, título y meta descripción. |
| `public/images/` | Imágenes públicas; preferir `.webp` optimizado. |
| `src/features/profile-grid/tiles/` | Componentes visuales de cada tipo de tile. |
| `src/features/profile-grid/ProfileGrid.tsx` | Filtra tiles, resuelve textos y reparte datos a cada componente. |

### Reglas de contenido

1. Todo texto visible o accesible debe existir en **español e inglés**.
2. No se inventan cargos, fechas, tecnologías, logros ni métricas. Lo que falta queda como `TODO(nestor):`.
3. Los textos de perfil viven en `profile.ts`; los de interfaz, en `ui.ts`. Los componentes no llevan contenido hardcodeado.
4. Los `href` aceptan solo `http://`, `https://` o `mailto:`.
5. Las imágenes deben tener `alt`, `width` y `height`; usa rutas como `/images/foto.webp` o URLs `https://`.
6. Las clases de Tailwind deben ser completas y estáticas. Nada de construir clases dinámicamente.

### Tiles disponibles

| Tipo | Contenido | Estado en el perfil actual |
|---|---|---|
| `avatar` | Foto de perfil circular fuera del grid. | Activo |
| `identity` | Nombre, headline y bio. | Activo |
| `specialty` | Especialidad, chips de stack y enlace al portafolio. | Activo |
| `experience` | Resumen y trayectoria completa en diálogo. | Activo |
| `link` | LinkedIn, GitHub, X u otro enlace. | LinkedIn activo |
| `spotify` | Playlist con fachada y reproductor bajo demanda. | Activo |
| `photo` | Foto con pie de foto. | Mascota activa |
| `top-list` | Top 3 de series. | Activo |
| `hobbies` | Dos hobbies con icono. | Activo |
| `projects` | Proyectos con resumen y enlace. | Sugerido |
| `contact` | CTA de correo con `mailto:`. | Sugerido |
| `now` | Qué estoy haciendo ahora. | Sugerido |
| `availability` | Zona horaria y modalidad. | Sugerido |

Los tamaños permitidos son `1x1`, `2x1`, `1x2` y `2x2`. En móvil todos ocupan una columna; el tamaño se conserva para tablet y desktop. El `avatar` no tiene tamaño de grid: es circular, mide 128 px en móvil y 160 px desde `sm`, y se renderiza antes de la cuadrícula. La mascota conserva su retrato 1x2 en móvil y pasa a 2x1 en tablet/desktop para cerrar el grid.

### Cómo agregar un tile

1. Añade o reutiliza una variante en `src/content/profile.types.ts`.
2. Si es un tipo nuevo, agrega su validación en `src/features/profile-grid/model/validateTile.ts`.
3. Añade los datos bilingües en `src/content/profile.ts`.
4. Crea el componente en `src/features/profile-grid/tiles/`.
5. Conéctalo en el `switch` de `ProfileGrid.tsx`.
6. Añade tests unitarios y, si aplica, E2E.

## Idioma, tema y URL

El idioma se resuelve **antes del primer render** con esta prioridad:

1. Parámetro `?lang=es|en`.
2. Preferencia en `localStorage` (`bento.locale`).
3. `navigator.language`: español si empieza con `es`; inglés en cualquier otro caso.
4. Inglés por defecto.

Al cambiar de idioma se actualizan los textos, `<html lang>`, `document.title`, la meta descripción y la URL mediante `history.replaceState`, sin recargar y sin peticiones de datos.

El tema se guarda en `bento.theme` (`light`, `dark` o `system`). El tema del sistema se resuelve con `prefers-color-scheme`. Un script inline en `index.html` aplica idioma y tema antes del pintado para evitar parpadeos.

> Si cambias el título o la descripción en `src/content/ui.ts`, actualiza también los valores equivalentes del script inline de `index.html`.

## Arquitectura

```text
src/
  app/                    # store de Redux y hooks tipados
  features/
    profile-grid/
      Header.tsx          # nombre, idioma y tema
      ProfileGrid.tsx     # filtro, resolución i18n y render de tiles
      model/              # contexto, provider, reducer y validación
      tiles/              # un componente por tipo de tile
    ui/                   # slice de tema/idioma y tema efectivo
  content/
    profile.ts            # contenido publicable
    profile.types.ts      # modelo tipado
    ui.ts                 # textos de interfaz ES/EN
  shared/
    components/           # Dialog, TileWrapper, estilos de tamaño...
    i18n/                 # Locale, Localized, resolución y hook
  test/                   # setup de Vitest
public/images/            # imágenes optimizadas que se publican
design-assets/images/     # originales y variantes que no se sirven
specs/                    # SPEC-001, SPEC-002 y SPEC-003
tests/                    # E2E de Playwright
```

Flujo principal:

```text
index.html → main.tsx → App → ProfileProvider → Header + ProfileGrid
                                                   └─ TileRenderer → tile por tipo
```

Redux Toolkit gestiona solo estado de UI. El documento del perfil vive en `ProfileProvider`, separado de la UI, para que el futuro editor reutilice el mismo modelo.

## Testing y calidad

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run e2e
```

La suite actual cubre:

- Resolución de idioma y prioridad URL → localStorage → navegador.
- Render de tiles, avatar fuera del grid, omisión de tiles inválidos y tiles sugeridos.
- Enlaces seguros, portafolio en Especialidad, diálogo de experiencia y fachada de Spotify.
- Responsive de 320 a 1920 px, sin scroll horizontal.
- Objetivos táctiles de 44×44 px.
- Grid sin celdas vacías en 2 y 4 columnas.
- Cambio de idioma sin recargar ni pedir datos.
- Tema claro/oscuro/sistema y persistencia.
- Accesibilidad con axe en las 4 combinaciones de idioma × tema.
- Imágenes con `alt`, dimensiones y prioridad de carga.

Resultado de la última corrida: **36 tests unitarios**, **34 E2E**, `typecheck`, `lint` y build en verde, y **0 vulnerabilidades** en la última auditoría con `npm audit` (sin cambios de dependencias desde entonces).

## Rendimiento

Medición local con Lighthouse 13.6, configuración móvil por defecto, sobre el build de producción servido con `vite preview`:

| Métrica | Resultado |
|---|---|
| Performance | 96 |
| Accessibility | 100 |
| Best Practices | 100 |
| First Contentful Paint | 1.3 s |
| Largest Contentful Paint | 2.5 s |
| Cumulative Layout Shift | 0 |
| Total Blocking Time | 130 ms |

El primer bundle suma aproximadamente **74 KB de JavaScript gzip** y **6.3 KB de CSS gzip**. Los umbrales de referencia del proyecto son LCP ≤ 2.5 s, CLS ≤ 0.1, TBT ≤ 200 ms y JS inicial ≤ 150 KB gzip.

Son métricas de laboratorio: no sustituyen datos de campo ni una medición en el hosting final.

## Build y deploy

```bash
npm run build
npm run preview
```

El resultado queda en `dist/` y se puede publicar en cualquier hosting estático (Vercel, Netlify, Cloudflare Pages, un servidor propio, etc.).

Notas:

- No hay router ni rutas internas; `?lang=es|en` se resuelve en cliente.
- El sitio usa rutas absolutas como `/images/...` y `/favicon.svg`, así que debe servirse desde la raíz del dominio o subdominio.
- Si se publica en una subcarpeta (por ejemplo, GitHub Pages sin dominio propio), ajusta `base` en `vite.config.ts` y las rutas públicas de imágenes.
- Para un deploy real, configura cache larga para assets con hash y cache corta para `index.html`.

## Roadmap

1. Cerrar las pruebas pendientes de SPEC-002 y verificar el comportamiento en contextos `es-SV`, `en-US` y `fr-FR`.
2. Publicar una demo y actualizar este README con la URL.
3. Implementar el editor local de SPEC-003 (`/?edit=1`) con carga diferida.
4. Añadir CI para typecheck, lint, tests, build y E2E.
5. Definir licencia y política de uso del contenido personal.

El detalle de lo hecho, los riesgos abiertos y el orden recomendado está en [PROJECT_STATUS.md](./PROJECT_STATUS.md).

## Documentación

- [Estado del proyecto](./PROJECT_STATUS.md)
- [SPEC-001 — Bento Grid del perfil](./specs/SPEC-001-profile-bento-grid.md)
- [SPEC-002 — Selector de idioma](./specs/SPEC-002-language-switcher.md)
- [SPEC-003 — Editor local](./specs/SPEC-003-local-bento-editor.md)
- [Convenciones del proyecto](./AGENTS.md)

---

**Autor:** Nestor Rivas | Frontend Developer.
