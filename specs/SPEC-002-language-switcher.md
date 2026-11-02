# SPEC-002 - Selector de idioma (ES / EN)

| Campo | Valor |
|---|---|
| Estado | Borrador |
| Feature | Web bilingüe con selector de idioma en la cabecera |
| Usuario principal | Visitante externo: hispanohablante (El Salvador, LatAm, España) o angloparlante/reclutador internacional |
| Depende de | SPEC-001 (grid), `AGENTS.md`, skill `brand-design` |

---

## 1. Definición del problema

**Situación.** El perfil se dirige a dos públicos: gente de la región, que espera español, y reclutadores o clientes remotos, que esperan inglés. Una web en un solo idioma deja fuera a uno de los dos o lo obliga a traducir con el navegador, que suele romper el diseño y deformar los términos técnicos.

**Problema.** El visitante no puede leer el perfil en su idioma ni cambiarlo cuando el detectado no es el que quiere.

**Resultado esperado.** La página se muestra en el idioma más probable del visitante, puede cambiarse con un control visible en un toque, el cambio es inmediato y sin recargar, se recuerda, se puede compartir por enlace y no rompe el diseño en ninguno de los dos idiomas.

**Fuera de alcance:** más idiomas que `es` y `en`, rutas separadas por idioma (`/es`, `/en`), traducción automática, detección por IP/geolocalización.

---

## 2. Diseño de la solución

### 2.1 Decisión técnica

i18n propio y ligero, **sin `react-i18next`**. La app tiene unas pocas decenas de textos de interfaz y un contenido fijo; una librería de i18n agrega peso y configuración que no se justifican. Si el proyecto crece a más idiomas o a pluralización compleja, se reevalúa con una spec nueva.

### 2.2 Tipos y fuentes de texto

```ts
// src/shared/i18n/types.ts
export type Locale = 'es' | 'en';
export type Localized<T = string> = Record<Locale, T>;

// src/content/ui.ts: textos de interfaz (botones, etiquetas, aria-labels, <title>)
type Dict = {
  pageTitle: string;
  metaDescription: string;
  themeToggleLabel: string;
  languageGroupLabel: string;
  languageChanged: string;       // anuncio para lectores de pantalla
  openOnSpotify: string;
  playHere: string;
  openExperience: string;
  closeDialog: string;
  // ...
};
export const ui = {
  en: { /* ... */ },
  es: { /* ... */ },
} satisfies Record<Locale, Dict>;   // si falta una clave en un idioma, no compila
```

- **Contenido de perfil** (`profile.ts`): los campos de texto libre usan `Localized` (headline, bio, detalle de trayectoria, pies de foto, alt de imágenes). Nombres propios (series, tecnologías, empresas) son `string` y no se traducen.
- **Interfaz** (`ui.ts`): todo texto de botones, etiquetas, `aria-label`, `<title>` y meta descripción.
- Los tiles reciben **textos ya resueltos** al idioma activo; la resolución la hace `ProfileGrid` con un hook `useLocalized()`.

### 2.3 Estado y prioridad de resolución

Estado en `uiSlice` (`locale: Locale`). Al arrancar, el idioma se resuelve **antes del primer render** (script síncrono en `main.tsx`), con esta prioridad:

1. Parámetro de URL `?lang=es|en`
2. Preferencia guardada en `localStorage` (`try/catch`)
3. `navigator.language`: `es` si empieza con `es`, `en` en cualquier otro caso
4. Valor por defecto: `en`

### 2.4 Qué cambia al elegir un idioma

- Todos los textos visibles del dashboard y del diálogo.
- `<html lang>`, `document.title` y la meta descripción.
- La URL se actualiza con `?lang=` (`history.replaceState`, sin añadir entradas al historial).
- Se guarda la preferencia en `localStorage`.
- Un `aria-live="polite"` anuncia el cambio ("Idioma cambiado a español" / "Language changed to English").

### 2.5 Interfaz del selector

- Control segmentado **ES | EN** en la cabecera, junto al botón de tema.
- Dos botones con `aria-pressed`; el activo se distingue por color **y** por peso/forma (no solo por color).
- Etiquetas visibles "ES" y "EN"; `aria-label` completo ("Español", "English") y atributo `lang` propio en cada uno. Sin banderas: una bandera representa un país, no un idioma.
- Cada botón ≥ 44×44 px; el grupo lleva `role="group"` con `aria-label` localizado.

### 2.6 Tolerancia a la longitud del texto

El español suele ser ~30 % más largo que el inglés. Los tiles no tienen alturas fijas (`min-h`, nunca `h-*`), los títulos usan `text-wrap: balance` y el texto corrido `hyphens: auto` apoyado en `<html lang>`.

---

## 3. Criterios de aceptación

| # | Criterio | Cómo se verifica |
|---|---|---|
| **AC-1** | La prioridad de resolución se cumple: con `?lang=en` y `localStorage` en `es`, la página abre en inglés; sin parámetro, usa lo guardado; sin ninguno, usa `navigator.language` (`es-SV` → `es`, `fr-FR` → `en`); sin señales, `en`. | Vitest sobre la función `resolveLocale()` con tabla de casos (mínimo 6). Playwright con `locale` de contexto distinto (`es-SV`, `en-US`, `fr-FR`). |
| **AC-2** | Al activar el otro idioma, todos los textos visibles cambian sin recargar la página y sin peticiones de red nuevas; `<html lang>`, `document.title` y la meta descripción cambian al nuevo idioma. | Playwright: capturar peticiones durante el cambio (0 nuevas); aserciones sobre `html[lang]`, `document.title` y `meta[name=description]`; comparar el texto visible de cada tile antes y después. |
| **AC-3** | La elección sobrevive a una recarga, la URL refleja `?lang=` sin crear entradas de historial, y abrir un enlace con `?lang=` muestra ese idioma. | Playwright: cambiar, recargar y comprobar idioma; `history.length` sin cambios; navegar a `/?lang=en` y `/?lang=es`. |
| **AC-4** | Completitud: ningún `Localized` de `profile.ts` ni clave de `ui.ts` tiene un idioma vacío o ausente, y no hay texto visible hardcodeado en componentes. | Vitest recorre `tiles` y `ui` y falla ante vacíos; `tsc` falla ante claves faltantes (`satisfies`); búsqueda de cadenas en `src/features` y `src/shared`: 0 coincidencias. |
| **AC-5** | Sin parpadeo ni saltos: el primer pintado ya sale en el idioma correcto (no hay texto en el idioma equivocado antes del correcto), CLS ≤ 0.1 al cambiar de idioma, y a 320 y 360 px ningún tile desborda ni corta su texto en ninguno de los dos idiomas. | Playwright: leer el DOM en `DOMContentLoaded` y comprobar idioma; medir `layout-shift` al cambiar; para cada tile en `es` y `en`: `scrollWidth <= clientWidth` y sin `overflow: hidden` recortando texto. |
| **AC-6** | El selector es accesible: `role="group"` con `aria-label` localizado, dos botones con `aria-pressed` correcto, `lang` propio en cada etiqueta, operable con Tab/Enter/Espacio, objetivos ≥ 44×44 px, y el cambio se anuncia en una región `aria-live="polite"`. | RTL para roles y atributos; Playwright para teclado, `boundingBox()` ≥ 44 px y texto de la región live tras el cambio. |
| **AC-7** | Las 4 combinaciones (es/claro, es/oscuro, en/claro, en/oscuro) no tienen violaciones axe `serious` o `critical`, y cambiar de idioma no cambia el tema ni al revés. | `@axe-core/playwright` en las 4 combinaciones; aserción de `data-theme` antes y después de cambiar idioma, y de `lang` antes y después de cambiar tema. |

---

## 4. Notas para el plan de implementación

1. `Locale`, `Localized`, `resolveLocale()` con sus pruebas → AC-1
2. `uiSlice.locale`, resolución antes del primer render, `useLocalized()` → AC-1, AC-5
3. `ui.ts` y migración de textos de SPEC-001 a `Localized` → AC-4
4. Selector en cabecera + efectos (`lang`, título, meta, URL, `localStorage`) → AC-2, AC-3, AC-6
5. Pasada de longitud de texto y combinaciones idioma × tema → AC-5, AC-7
