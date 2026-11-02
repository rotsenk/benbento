---
name: brand-design
description: Sistema de diseño de marca del Bento personal de Nestor (colores, tipografía, tiles, tono de voz, movimiento). Úsala siempre que se cree o modifique cualquier componente visual, tile, estilo, color, fuente, espaciado, animación, imagen o texto visible de la app, incluso si el pedido no menciona "marca" o "diseño" (por ejemplo "agrega un tile", "cambia el botón", "escribe el texto de la bio", "ajusta el modo oscuro"). Aplícala también al escribir textos en español o inglés, al tocar el selector de idioma o el tema claro/oscuro, y al revisar que un cambio respete la identidad visual o las métricas de UX.
---

# Skill: brand-design

Guía para que cada pantalla y cada línea de texto de la app se sienta como la misma persona: un developer salvadoreño, serio con su trabajo, cercano en el trato y honesto sobre lo que sabe.

## 1. Esencia de marca

**Idea central:** *competente y cercano, sin humo.*

| Rasgo | Se nota en | Nunca se convierte en |
|---|---|---|
| Claro | Jerarquía simple, mucho aire, una acción principal por tile | Minimalismo frío o vacío |
| Cálido | Tonos cremosos, fotos reales, un toque de humor en lo personal | Informalidad que reste seriedad al perfil profesional |
| Honesto | Textos con hechos concretos y años reales | Superlativos, adjetivos inflados, "expert", "rockstar", "passionate" |
| Pulido | Alineación, radios y espaciado consistentes | Efectos llamativos por decorar |

## 2. Tokens de color

Definir como variables CSS en `src/index.css` y exponer en Tailwind. **Ningún componente usa hexadecimales directos.**

```css
:root {
  --bg: #F7F5F0;          /* fondo de página */
  --surface: #FFFFFF;     /* tile base */
  --surface-2: #EFECE4;   /* tile secundario / chips */
  --ink: #14161A;         /* texto principal */
  --ink-muted: #5B6068;   /* texto secundario */
  --line: #E3DFD5;        /* bordes */
  --accent: #1F4FD8;      /* acción, foco, enlaces */
  --accent-ink: #FFFFFF;  /* texto sobre accent */

  --tint-sky: #D6E4FF;    /* experiencia, especialidad */
  --tint-sun: #FFE9A8;    /* hobbies */
  --tint-coral: #FFD6CC;  /* mascota / foto personal */
  --tint-mint: #CDEFE0;   /* series, música */
}

:root[data-theme='dark'] {
  --bg: #0F1115;
  --surface: #171A20;
  --surface-2: #1F232B;
  --ink: #F2F0EA;
  --ink-muted: #A3A8B2;
  --line: #2A2F38;
  --accent: #7C9CFF;
  --accent-ink: #0F1115;

  --tint-sky: #1E2A4A;
  --tint-sun: #3A3118;
  --tint-coral: #3D2722;
  --tint-mint: #1B3329;
}
```

Mapeo en Tailwind (v3: `theme.extend.colors`; en v4 equivale a `@theme`):

```ts
colors: {
  bg: 'var(--bg)', surface: 'var(--surface)', 'surface-2': 'var(--surface-2)',
  ink: 'var(--ink)', 'ink-muted': 'var(--ink-muted)', line: 'var(--line)',
  accent: 'var(--accent)', 'accent-ink': 'var(--accent-ink)',
  tint: { sky: 'var(--tint-sky)', sun: 'var(--tint-sun)', coral: 'var(--tint-coral)', mint: 'var(--tint-mint)' },
}
```

**Reglas de uso**
- Fondo de página: `bg`. Tiles: `surface` por defecto; un tint por tile para dar ritmo, no más de 4 tiles con tint a la vez.
- `accent` solo para acciones (enlaces, botones, foco). No lo uses de decoración.
- Texto siempre `ink` o `ink-muted`. Contraste mínimo 4.5:1 para texto normal; verifícalo con axe en ambos temas.
- Si agregas un color, agrégalo primero aquí con su variante oscura.

**Asignación de tints por tile**

| Tile | Fondo |
|---|---|
| `identity` | `surface` |
| `specialty`, `experience` | `tint-sky` |
| `spotify`, `series` | `tint-mint` |
| `pet` | `tint-coral` |
| `hobbies` | `tint-sun` |
| `linkedin` | `accent` con `accent-ink` |
| sugeridos (`projects`, `github`, `contact`, `now`, `availability`) | `surface` o `surface-2` |

## 3. Tipografía

Autoalojadas con `@fontsource` (sin peticiones a Google Fonts), `font-display: swap`. Paquetes: `@fontsource/space-grotesk`, `@fontsource/inter` y `@fontsource/jetbrains-mono`.

| Uso | Fuente | Pesos |
|---|---|---|
| Títulos y nombre | Space Grotesk | 600, 700 |
| Texto | Inter | 400, 500 |
| Chips, años, etiquetas técnicas | JetBrains Mono | 500 |

Escala (móvil → escritorio):

| Rol | Tamaño | Notas |
|---|---|---|
| Nombre (hero) | 32 → 44 px | Space Grotesk 700, interlineado 1.1 |
| Título de tile | 18 → 20 px | Space Grotesk 600 |
| Texto | 15 → 16 px | Inter 400, interlineado 1.5 |
| Etiqueta / chip | 12 → 13 px | JetBrains Mono 500, sin mayúsculas forzadas |

Máximo dos pesos por tile. Longitud de línea de texto corrido ≤ 60 caracteres. Importar los subconjuntos `latin` y `latin-ext` para que acentos y ñ se vean con la fuente de marca y no con una de respaldo.

## 4. Anatomía del tile

| Propiedad | Valor |
|---|---|
| Radio | 24 px (`rounded-3xl`); elementos internos 12–16 px |
| Padding | 20 px móvil, 24 px escritorio |
| Borde | 1 px `line` |
| Sombra | Muy suave: `0 1px 2px rgb(0 0 0 / 0.04)`; sin sombras pesadas |
| Gap entre tiles | 12 px móvil, 16 px escritorio |
| Estructura interna | Etiqueta pequeña (qué es) → contenido principal → acción (si hay) |
| Tile de enlace | Ícono de flecha ↗ arriba a la derecha; todo el tile es clickeable |
| Foco | Anillo 2 px `accent` con separación de 2 px; nunca `outline: none` sin reemplazo |

**Fotos:** reales, sin filtros ni efectos. `object-fit: cover`, esquinas internas con radio 16 px. Foto de perfil con buena luz y el rostro centrado en el tercio superior. La foto con mascota va a sangre completa dentro del tile con el pie de foto superpuesto sobre un degradado suave.

**Íconos:** un solo set: Phosphor Icons (`@phosphor-icons/react`, licencia MIT). No mezclar sets.
- Tamaño 20–24 px (28 px en íconos de tile destacado).
- Peso por defecto: `regular`. Íconos de hobbies y de tiles con tint: `duotone`. Estado activo o enfatizado: `fill`. No mezclar más de dos pesos en una misma vista.
- Logos de marca (LinkedIn, Spotify, GitHub): usar los de Phosphor (`LinkedinLogo`, `SpotifyLogo`, `GithubLogo`) con el color `ink` o `accent-ink`, no con el color oficial de cada marca.
- Importar solo los íconos usados (`import { SpotifyLogo } from '@phosphor-icons/react'`) para no inflar el bundle.
- Todo ícono decorativo lleva `aria-hidden`; si es el único contenido de un botón, el botón lleva `aria-label`.

## 5. Movimiento

- Hover/foco en tiles interactivos: elevación de 2 px y borde `accent`, 150–200 ms, `ease-out`.
- Entrada de la página: fundido corto escalonado de tiles (máx. 40 ms entre tiles, 300 ms en total por tile). Opcional.
- Apertura del diálogo: fundido + leve escala (0.98 → 1), 180 ms.
- **Respetar `prefers-reduced-motion`:** con la preferencia activa, sin transformaciones ni escalonado; solo cambios de color instantáneos.
- Nada de animaciones en bucle, parallax ni efectos de cursor.

## 6. Voz y tono del copy

**Persona:** hablo en primera persona, sencillo y directo, como quien explica su trabajo a alguien que le cae bien.

**Reglas**
1. Hechos antes que adjetivos: años, tecnologías, resultados reales.
2. Frases cortas. Una idea por frase.
3. Cero superlativos y cero clichés de CV.
4. En lo personal (series, hobbies, mascota), un toque de humor está bien; en lo profesional, sobrio.
5. No usar emojis en su lugar iconografía.
6. Inglés: lenguaje llano, frases cortas, que suene a persona y no a plantilla.
7. Español: neutro y cálido, sin regionalismos marcados; se dirige al visitante de forma impersonal o con "tú", sin voseo.
8. Ambos idiomas dicen lo mismo, con el mismo tono. No traduzcas palabra por palabra; adapta la frase para que suene natural en cada uno.
9. No afirmes nada que no esté respaldado por `profile.ts`. Si falta el dato: `TODO(nestor):`.
10. No inventes logros, títulos, premios ni experiencia. No digas "experto", "rockstar", "passionate" ni nada que no pueda demostrarse con hechos.
11. No uses frases de relleno como "busco nuevos retos", "me apasiona la tecnología" o "soy un profesional con gran experiencia". No digas lo que quieres ser; di lo que eres y lo que haces.
12. No uses mayúsculas forzadas ni negritas en el texto corrido. Solo títulos y etiquetas técnicas van en mayúscula o negrita.
13. Mi nombre es "Nestor" no "Néstor". No usar acento en el nombre propio.

**Ejemplos (formato; los datos reales los define `profile.ts`)**

| En vez de | Escribe |
|---|---|
| "Desarrollador apasionado con gran experiencia en tecnología" | "Frontend developer. Construyo SPAs empresariales con React y TypeScript." |
| "Experto en múltiples tecnologías" | Lista de las tecnologías que uso a diario, sin relleno |
| "Mi increíble mascota" | "Este es [nombre], el que decide cuándo termina mi jornada." |

**Titulares de etiqueta de cada tile:** sustantivos cortos ("Especialidad", "Trayectoria", "Ahora", "Top 3 series"). No frases largas.

## 7. Qué evitar

- Gradientes llamativos, glassmorphism, neón o fondos animados.
- Más de un color de acento.
- Sombras fuertes, bordes dobles, tiles de radios distintos.
- Fotos de stock o ilustraciones genéricas en lugar de fotos reales.
- Texto sobre imagen sin garantizar contraste (usar degradado detrás).
- Tipografías fuera de las tres definidas.

## 8. Checklist de revisión (úsalo antes de dar por terminado un cambio visual)

- [ ] Colores y espaciado salen de tokens; sin hex sueltos
- [ ] Probado en tema claro y oscuro
- [ ] Contraste de texto ≥ 4.5:1 (axe sin violaciones `serious`/`critical`)
- [ ] Tipografía y escala según la tabla de la sección 3
- [ ] Radio, padding, borde y gap de tile según la sección 4
- [ ] Foco visible y objetivos táctiles ≥ 44 px
- [ ] Movimiento respeta `prefers-reduced-motion`
- [ ] Copy en primera persona, sin superlativos, sin datos inventados
- [ ] Nuevo tint o color agregado primero a la sección 2 con su variante oscura
- [ ] Probadas las 4 combinaciones: español/inglés × claro/oscuro
- [ ] Textos con ~30 % más de longitud no rompen el tile (el español suele ser más largo)
- [ ] Cumple las métricas de la sección 10

## 9. Cabecera, selector de idioma y tema

- **Cabecera:** 56–64 px de alto. Nombre o monograma a la izquierda; a la derecha, selector de idioma y botón de tema, con el mismo estilo (pastilla con borde `line` y fondo `surface`).
- **Selector de idioma:** control segmentado **ES | EN**. El activo se distingue por color **y** por peso o forma, no solo por color. Etiquetas cortas visibles; `aria-label` completo ("Español", "English") y atributo `lang` propio en cada una. **Sin banderas:** una bandera representa un país, no un idioma.
- **Botón de tema:** íconos `Sun` y `Moon` de Phosphor; muestra la acción disponible (en oscuro, el sol) y lleva `aria-label` localizado. El tema por defecto sigue la preferencia del sistema.
- **Transiciones:** cambiar idioma o tema es inmediato; solo se anima el color (150 ms). Nunca se anima el layout.
- **Longitud de texto:** títulos con `text-wrap: balance`; texto corrido con `hyphens: auto` apoyado en `<html lang>`. Probar siempre ambos idiomas.

## 10. Métricas UX/UI (umbrales a cumplir)

| Métrica | Umbral |
|---|---|
| Objetivo táctil | ≥ 44×44 px (más estricto que el mínimo AA de WCAG 2.2, 24 px), separación ≥ 8 px |
| Contraste de texto | ≥ 4.5:1 (≥ 3:1 en texto de 24 px o más, o 19 px en negrita) |
| Contraste de componentes y foco | ≥ 3:1 |
| Largo de línea | 45–75 caracteres; en texto corrido, ≤ 60 |
| Interlineado | ≥ 1.5 en texto corrido |
| Escala de espaciado | Múltiplos de 4 px (4, 8, 12, 16, 24, 32, 48) |
| Jerarquía | Un solo protagonista por vista (el nombre); máx. 3 niveles de énfasis por tile |
| Arriba del pliegue (390×844 px) | `identity` y el enlace de LinkedIn visibles |
| Reflow | Sin scroll horizontal a 320 px |
| Zoom de texto | Usable al 200 % sin pérdida de contenido |
| Respuesta a la interacción | Feedback visual ≤ 100 ms; INP ≤ 200 ms |
| Core Web Vitals | LCP ≤ 2.5 s · CLS ≤ 0.1 · INP ≤ 200 ms |
