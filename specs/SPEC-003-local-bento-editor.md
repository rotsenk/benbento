# SPEC-003 - Editor local del Bento

| Campo | Valor |
|---|---|
| Estado | Borrador |
| Feature | Editor local para armar, editar y publicar el grid sin tocar código |
| Usuario principal | Nestor (dueño del perfil), en desktop o móvil |
| Depende de | SPEC-001 (grid público), SPEC-002 (idioma), `AGENTS.md`, skill `brand-design` |
| Relacionada | Flujo de publicación estática: exportar `profile.ts` y hacer deploy |

---

## 1. Definición del problema

**Situación.** SPEC-001 deja la página pública lista para leer, pero el contenido vive fijo en `src/content/profile.ts`. Cambiar un texto, ocultar un tile, probar otro tamaño o reordenar obliga a editar código y volver a desplegar.

**Problema.** El dueño del perfil no puede iterar el layout ni el contenido desde el navegador, y por lo tanto el grid se queda como se escribió la primera vez.

**Usuario y necesidad.** Nestor quiere abrir un editor, mover y redimensionar tiles, editar los textos en español e inglés, ver el resultado y guardar un borrador. Cuando esté conforme, quiere exportar el contenido y publicarlo con el flujo estático.

**Resultado esperado.** Un editor local en `/?edit=1`, con drag & drop accesible, cambio de tamaño, alta/baja/ocultar tiles, edición bilingüe, persistencia en `localStorage` e import/export. Sin backend, sin login y sin publicación automática.

**Fuera de alcance de esta spec:** backend, cuentas, login, multiperfil, URL pública por usuario, publicación automática, analíticas, colaboración, historial de versiones, subida de imágenes, editor de colores libres y grid libre con huecos.

---

## 2. Diseño de la solución

### 2.1 Decisiones

- **Rutas:** página pública en `/`; editor en `/?edit=1`. No hay router: se usa `URLSearchParams` y se conserva `?lang=es|en`.
- **Carga:** el editor se importa con `React.lazy()` solo cuando `?edit=1`. El bundle público no incluye el editor ni `@dnd-kit`.
- **Documento:** `BentoDocument = { version: 1; tiles: Tile[] }`, reutilizando `Tile` de SPEC-001. El orden del array es el orden visual; no existe un campo `order`.
- **Estado:** el documento vive en `ProfileProvider` (Context + `useReducer`). Redux Toolkit sigue siendo solo para UI (tema, idioma, panel abierto, tile seleccionado).
- **Persistencia:** borrador en `localStorage` con la clave `bento.document.v1`, dentro de `try/catch` y validado al leer. Si falta o está corrupto, se usa el default de `profile.ts` y se avisa.
- **Página pública:** siempre lee `profile.ts`. El borrador solo se muestra en `?edit=1` o en el modo vista previa del editor.
- **Publicación:** exportar `profile.ts`, reemplazar `src/content/profile.ts`, correr los checks y hacer deploy. No hay escritura automática ni backend.
- **Imágenes:** solo ruta o URL (`/images/pet.webp` o `https://…`). No hay subida de archivos.
- **Temas:** claro, oscuro y sistema. Sin colores libres ni presets nuevos.
- **Drag & drop:** `@dnd-kit/core`, `@dnd-kit/sortable` y `@dnd-kit/utilities`. Justificación: drag accesible con teclado y touch sin sumar un motor de grid pesado. Se carga solo en el editor.
- **Resize:** selector de tamaño `1x1`, `2x1`, `1x2`, `2x2`. No hay resize libre por píxeles.
- **Grid:** compacto de 4 columnas en desktop. No es un lienzo libre con huecos; si se cambia a posiciones libres, requiere otra spec.

### 2.2 Flujo de uso

1. Nestor abre `/?edit=1`.
2. `ProfileProvider` intenta cargar `bento.document.v1` de `localStorage`. Si no existe o no es válido, parte del default de `profile.ts`.
3. El editor muestra el grid y un panel con la lista de tiles y el formulario del tile seleccionado.
4. Cada cambio actualiza el documento y se guarda con debounce en `localStorage`.
5. “Vista previa” muestra el grid público con el borrador; “Salir” vuelve a `/`.
6. “Exportar” descarga `profile.ts` y un JSON de respaldo. “Importar” acepta JSON.
7. Para publicar, reemplaza `src/content/profile.ts` con el archivo exportado y hace deploy.

### 2.3 Modelo de datos

```ts
import type { Tile } from '@/content/profile.types';

export interface BentoDocument {
  version: 1;
  tiles: Tile[];
}
```

Reglas:

- `id` único y no vacío. Los tiles nuevos usan `crypto.randomUUID()`.
- Como máximo un tile `identity`. Los demás tipos pueden repetirse.
- `enabled` funciona como visibilidad: un tile oculto conserva su contenido.
- `size` solo acepta `1x1`, `2x1`, `1x2` o `2x2`.
- Borrador incompleto permitido: el editor puede guardar textos vacíos, pero **no puede exportar** hasta que todos los tiles estén completos en ES y EN.
- La validación es estructural al cargar y completa al exportar. Un borrador estructuralmente inválido se descarta y se usa el default.
- `version: 1` es la única versión aceptada. Una versión desconocida se rechaza con mensaje, sin migración silenciosa.

Campos obligatorios por tipo:

| Tipo | Obligatorio |
|---|---|
| `identity` | `name`, `headline` ES/EN, `bio` ES/EN, `photo` con `src`, `alt` ES/EN, `width`, `height` |
| `specialty` | `title` ES/EN, al menos un chip |
| `experience` | `summary` y `timeline` con `period`, `role` ES/EN y `place` |
| `link` | `platform`, `label`, `handle`, `href` válido |
| `spotify` | `title` ES/EN, `playlistId`, `href` válido |
| `photo` | `image` con `src`, `alt` ES/EN, `width`, `height`, `caption` ES/EN |
| `top-list` | `title` ES/EN y exactamente 3 ítems |
| `hobbies` | `title` ES/EN y exactamente 2 hobbies con `label` ES/EN e `icon` |
| `projects` | `title` ES/EN y 1–2 proyectos con `name` y `summary` ES/EN |
| `contact` | `title` ES/EN, `email`, `href` `mailto:` válido |
| `now` | `title` ES/EN, `body` ES/EN |
| `availability` | `title` ES/EN, `timezone`, al menos un modo ES/EN |

Validación de URLs e imágenes:

- `href` de enlaces: solo `http://`, `https://` o `mailto:`. Se rechazan `javascript:`, `data:` y esquemas vacíos.
- `image.src`: ruta relativa que empiece con `/` o `./`, o URL `https://`. Se rechazan `javascript:` y `data:`.
- Un `href` o `src` inválido se marca como error y bloquea la exportación; el borrador puede guardarse para no perder el trabajo.

### 2.4 Interfaz del editor

**Cabecera del editor**

- Título “Editor”.
- Botón “Vista previa” (alterna el grid público con el borrador).
- Botón “Salir” (vuelve a `/`).
- Botón “Exportar” (descarga `profile.ts` y JSON).
- Botón “Importar” (input de archivo JSON).
- Botón “Restablecer” (vuelve al default, con confirmación).

**Panel de tiles**

- Lista ordenada con: drag handle, etiqueta del tipo, ojo de visibilidad, selector de tamaño, editar y eliminar.
- Botones “Mover arriba” y “Mover abajo” como alternativa accesible al drag.
- Botón “Agregar tile” que abre el catálogo. `identity` se deshabilita si ya existe.
- Eliminar pide confirmación.

**Formulario del tile seleccionado**

- Campos agrupados por tipo, con etiqueta y ayuda.
- Textos bilingües en dos columnas en desktop y en pestañas ES/EN en móvil.
- Botón “Copiar ES → EN” en los campos de texto libre.
- Errores inline y resumen de errores al intentar exportar.
- Vista previa de imagen y campos de `alt` ES/EN, `width`, `height`.
- Para enlaces: validación de protocolo en el mismo formulario.

**Estado**

- “Guardado localmente a las HH:MM” cuando el debounce termina.
- “Cambios sin exportar” cuando el documento difiere del último export.
- Aviso si el borrador no se pudo cargar o si `localStorage` no está disponible.

**Drag & drop**

- Solo el handle inicia el arrastre; los enlaces y botones dentro del tile siguen funcionando.
- Sensores: pointer, touch y teclado. Con teclado: Enter/Espacio para tomar, flechas para mover, Enter/Espacio para soltar, Esc para cancelar.
- Anuncios en una región `aria-live="polite"` (“Tile movido a la posición 3 de 8”).
- El foco vuelve al handle del tile movido.

### 2.5 Layout y responsive

- **Grid público:** 4 columnas desde 1024 px, 2 columnas de 640 a 1023 px y 1 columna por debajo de 640 px. Contenedor máximo 1120 px.
- **Tamaños en desktop:** `1x1` ocupa 1 columna; `2x1` y `2x2` ocupan 2 columnas; `1x2` y `2x2` usan una altura mínima doble.
- **Móvil:** todos los tiles ocupan 1 columna. El tamaño elegido se conserva para desktop; no se pierde al recargar.
- **Alturas:** `min-h` y contenido; nunca `h-*` fija. El texto largo empuja la altura.
- **Editor:** panel lateral de 360–400 px en desktop; panel a pantalla completa en móvil. Sin scroll horizontal a 320 px.
- **Objetivos táctiles:** ≥ 44×44 px, con separación ≥ 8 px.
- **Zoom:** usable al 200 % sin pérdida de contenido.
- **Movimiento:** respeta `prefers-reduced-motion`; sin animaciones en bucle.

### 2.6 Import/export

**Exportar `profile.ts`**

```ts
import type { BentoDocument } from './profile.types';

export const profile = {
  version: 1,
  tiles: [
    // …
  ],
} satisfies BentoDocument;
```

- El archivo se genera con `JSON.stringify(document, null, 2)` para evitar errores de escape.
- Se descarga como `profile.ts`.
- También se descarga `bento-backup.json` con el mismo documento.
- Si hay campos incompletos, la exportación se bloquea y se muestran los errores.

**Importar**

- Solo JSON. No se importa `profile.ts` porque requeriría evaluar código.
- Se valida estructura, versión, tipos, URLs y campos obligatorios.
- Un JSON inválido, con versión desconocida o con URLs peligrosas se rechaza con un mensaje y **no** reemplaza el borrador actual.
- Un JSON válido reemplaza el borrador y se guarda en `localStorage`.

### 2.7 Accesibilidad

- WCAG 2.2 AA como piso.
- El editor se opera completo con teclado: agregar, seleccionar, editar, mover, redimensionar, ocultar, eliminar, exportar e importar.
- El panel es una región con `aria-label` localizado. En móvil, cuando ocupa toda la pantalla, se comporta como diálogo modal con foco atrapado y retorno al botón que lo abrió.
- Drag & drop no es la única forma de mover: existen “Mover arriba/abajo”.
- El selector de tamaño usa botones con `aria-pressed`.
- Los anuncios de drag, guardado, importación y errores usan `aria-live`.
- Foco visible en todos los controles; contraste ≥ 4.5:1 en texto y ≥ 3:1 en bordes y foco.
- Las 4 combinaciones ES/EN × claro/oscuro deben pasar axe sin violaciones `serious` o `critical`.

### 2.8 Rendimiento

- El editor y `@dnd-kit` se cargan solo en `?edit=1` con `lazy()` + `Suspense`.
- El bundle público mantiene el presupuesto de SPEC-001: JS inicial ≤ 150 KB gzip.
- El borrador solo guarda texto y rutas de imagen; no hay base64 ni archivos pesados en `localStorage`.
- Sin peticiones de red para guardar ni para publicar.

---

## 3. Criterios de aceptación

| # | Criterio | Cómo se verifica |
|---|---|---|
| **AC-1** | `/?edit=1` muestra el editor y el grid editable; `/` muestra solo la página pública y no solicita el chunk del editor ni `@dnd-kit`. Cambiar `?lang=en` dentro del editor conserva el idioma y el borrador. | Playwright: presencia/ausencia de `[data-editor]` y del panel; lista de peticiones de red en `/` sin el chunk del editor; navegar `?edit=1&lang=en` y comprobar `html[lang]` y textos. |
| **AC-2** | Agregar, eliminar, ocultar, reordenar y cambiar tamaño actualiza el grid; el estado sobrevive a una recarga; “Restablecer” vuelve exactamente al default de `profile.ts`. | Vitest sobre el reducer con acciones de cada operación; Playwright: editar, recargar, comprobar `data-tile-id`, `data-size`, orden y visibilidad; reset y comparación con el default. |
| **AC-3** | El drag & drop funciona con puntero y con teclado (tomar, mover, soltar, cancelar), los botones “Mover arriba/abajo” reordenan, el selector de tamaño cambia `data-size` y el grid, se anuncia el cambio y el foco vuelve al handle. | Playwright: drag con mouse, secuencia de teclado, botones, `boundingBox()` de posiciones, texto de `aria-live` y `document.activeElement`. |
| **AC-4** | Todos los campos editables existen en ES y EN; el editor bloquea la exportación si falta un idioma o un campo obligatorio; los mensajes de error están localizados; no hay texto de contenido hardcodeado en componentes. | RTL: formulario bilingüe, campos vacíos y bloqueo de exportación; Playwright: mensajes en ES y EN; búsqueda de cadenas en `src/features` y `src/shared`: 0 coincidencias de contenido de perfil. |
| **AC-5** | Exportar produce un `profile.ts` que compila y un JSON que, al reimportarlo, reconstruye el mismo documento. Un JSON inválido, con versión desconocida o con URLs `javascript:`/`data:` se rechaza sin pisar el borrador. | Vitest: serialización, round-trip JSON, validación de versión/URLs; compilar el `profile.ts` exportado con `tsc --noEmit`; Playwright: importar archivo inválido y comprobar que el documento no cambió. |
| **AC-6** | El editor es usable a 320, 360 y 390 px sin scroll horizontal; el panel pasa a pantalla completa; el grid público usa 1, 2 y 4 columnas en los breakpoints definidos; los controles miden ≥ 44×44 px y el zoom al 200 % no pierde contenido. | Playwright en 320, 360, 390, 768, 1024, 1280 y 1920: `scrollWidth <= clientWidth`, `boundingBox()` de controles, `grid-template-columns` computado y zoom de texto. |
| **AC-7** | En las 4 combinaciones ES/EN × claro/oscuro, la página pública y el editor no tienen violaciones axe `serious`/`critical`; el editor se opera con teclado; el foco del panel móvil queda atrapado y vuelve al origen; `prefers-reduced-motion` elimina transformaciones y animaciones. | `@axe-core/playwright` en las 4 combinaciones sobre `/` y `/?edit=1`; Playwright con teclado y `emulateMedia({ reducedMotion: 'reduce' })`; comprobar `transform`/`transition` ausentes en drag y apertura del panel. |

---

## 4. Notas para el plan de implementación

Orden sugerido (cada paso cierra uno o más criterios):

1. `BentoDocument`, reducer, validadores y adaptador de `localStorage` → AC-2
2. Carga condicional del editor con `lazy()` y ruta `?edit=1` → AC-1
3. Lista de tiles: agregar, eliminar, ocultar y mover con botones → AC-2, AC-3
4. Drag & drop con `@dnd-kit` y alternativa de teclado → AC-3
5. Selector de tamaño y mapa de spans → AC-2, AC-6
6. Formularios bilingües, validación de URLs e imágenes → AC-4, AC-5
7. Vista previa, exportación `profile.ts`/JSON e importación → AC-5
8. Responsive, accesibilidad, axe y medición del bundle → AC-6, AC-7

Dependencias y justificación:

- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`: drag accesible con teclado/touch, sin motor de grid ni posicionamiento absoluto. Solo se cargan en el editor.
- No se agrega router: `URLSearchParams` basta para dos modos.
- No se agrega `react-grid-layout`: el grid compacto con CSS Grid y orden por array cubre el alcance.
- No se agrega librería de validación: los validadores se escriben a mano y se cubren con Vitest.

Riesgos:

- **Tiles de distinto tamaño con dnd-kit:** `rectSortingStrategy` puede sentirse imprecisa; si pasa, se prueba `rectSwappingStrategy` o se priorizan los botones de mover.
- **Grid compacto vs. Bento libre:** no habrá huecos ni posiciones exactas. Es una decisión de alcance, no un bug.
- **Borrador local por navegador:** no se sincroniza entre dispositivos. Para publicar hay que exportar y hacer deploy.
- **Imágenes manuales:** el editor no sube archivos; hay que dejar las fotos en `public/images` y referenciarlas.
- **Contenido real pendiente:** los datos que falten siguen como `TODO(nestor):`; el editor los marca y no inventa nada.
