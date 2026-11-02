# AGENTS.md — Bento personal de Nestor Rivas

> Contexto persistente. Léelo completo antes de tocar código. Si algo de aquí choca con una spec en `specs/`, gana la spec para ese feature y me avisas de la diferencia.

## 1. Qué es este proyecto

Una web de una sola página (SPA) con aspecto de dashboard, al estilo del extinto Bento.me: una **tarjeta de presentación personal** hecha de tiles (bloques) en una cuadrícula. Cada tile muestra un pedazo de mi identidad (foto, especialidad, trayectoria, playlist, series, hobbies…). Los tiles de enlace llevan fuera de la app (LinkedIn, Spotify, GitHub…). No hay backend, ni login, ni base de datos. Incluye un **editor local** en `/?edit=1` para armar el grid sin tocar código; el borrador vive en el navegador y se publica exportando `profile.ts` (ver SPEC-003).

**Quién la va a ver:** reclutadores, clientes potenciales y colegas, casi siempre desde el celular y con poco tiempo. En 10 segundos tienen que saber quién soy, en qué soy bueno y cómo contactarme.

**Quién soy (para que escribas copy con criterio):** Frontend Developer, con enfoque en SPAs empresariales. Más de 5 años de experiencia previa en educación superior (coordinación de carreras de IT y docencia) y alrededor de 3 años de desarrollo de software profesional.

## 2. Stack (fijo, no lo cambies sin preguntarme)

- React + TypeScript (`strict: true`) + Vite
- Tailwind CSS v4 para estilos (toda la UI se construye con Tailwind; sin CSS aparte salvo los tokens en `index.css`)
- Íconos: `@phosphor-icons/react` (único set permitido)
- Fuentes autoalojadas con `@fontsource` (Space Grotesk, Inter, JetBrains Mono), subconjuntos `latin` y `latin-ext` (acentos y ñ)
- i18n propio y ligero (sin `react-i18next`): tipos `Locale` y `Localized` en `src/shared/i18n/types.ts`, diccionario tipado en `ui.ts`. Idiomas: `es` y `en`
- Redux Toolkit **solo** para estado de UI (tema, idioma, panel abierto, selección del editor). El documento del perfil vive en `ProfileProvider` (Context + `useReducer`), no en Redux
- Editor local: `@dnd-kit/core`, `@dnd-kit/sortable` y `@dnd-kit/utilities`, cargados con `lazy()` solo en `?edit=1`. Justificación: drag accesible con teclado y touch sin sumar un motor de grid completo ni meterlo en el bundle público
- Vitest + React Testing Library (unitarios/componentes)
- Playwright + `@axe-core/playwright` (e2e, responsive y accesibilidad)
- ESLint + Prettier

**Dependencias nuevas:** no agregues ninguna sin justificarla en una línea (qué resuelve y por qué no basta lo que ya hay). Prefiero poco peso: es una página de presentación.

## 3. Estructura

```
src/
  app/                  # store.ts, hooks.ts (useAppDispatch/useAppSelector tipados)
  features/
    profile-grid/       # página pública: ProfileGrid.tsx, tiles/, model/
    editor/             # editor local: panel, formulario, dnd, import/export
    ui/                 # uiSlice.ts (theme, locale, activeDialog, editor)
  content/
    profile.ts          # contenido por defecto (publicable)
    profile.types.ts    # BentoDocument, Tile, ImageRef, etc.
    ui.ts               # textos de interfaz en es/en
  shared/               # componentes y utilidades reutilizables
    components/         # Dialog, VisuallyHidden, IconButton…
    i18n/               # Locale, Localized, resolveLocale(), useLocalized()
  test/                 # setup de Vitest
public/images/          # fotos optimizadas (.webp)
specs/                  # SPEC-001 (público), SPEC-002 (idioma), SPEC-003 (editor)
.opencode/skills/       # skills del proyecto (brand-design/SKILL.md)
AGENTS.md
```

### 3.1 Editor local (SPEC-003)

- Se abre con `/?edit=1`; la página pública es `/`. No hay router: se usa `URLSearchParams` y se conserva `?lang=es|en`.
- El editor no se incluye en el bundle público: se carga con `React.lazy()`.
- El borrador se guarda en `localStorage` con la clave versionada `bento.document.v1`, dentro de `try/catch` y validado al leer.
- El editor permite agregar, quitar, ocultar, reordenar y cambiar tamaño (`1x1`, `2x1`, `1x2`, `2x2`) de tiles, editar textos ES/EN e importar/exportar JSON.
- Para publicar: exportar `profile.ts`, reemplazar `src/content/profile.ts`, correr los checks y hacer deploy. No hay publicación automática.
- Imágenes: solo ruta o URL (por ejemplo `/images/pet.webp`). No hay subida de archivos ni backend.
- Temas: solo claro, oscuro y sistema. No hay editor de colores libres.

### 3.2 Reglas de Optimización y Rendimiento - 
Código Liviano: Priorizar eficiencia. 
Rendimiento Móvil: Minimizar el uso de scripts pesados y manipulación innecesaria del DOM para asegurar ejecución fluida en teléfonos de gama baja/media. 
Carga Rápida: Optimizar recursos para que la app responda al instante en conexiones móviles (3G/4G).

## 4. Comandos (ajusta si cambia el gestor de paquetes)

```
npm run dev         # servidor local
npm run build       # build de producción
npm run typecheck   # tsc --noEmit
npm run lint
npm run test        # Vitest
npm run e2e         # Playwright (usa el build de producción)
```

## 5. Convenciones de código

- Componentes funcionales, un componente por archivo, nombre en `PascalCase`. Hooks en `useCamelCase`.
- Identificadores, nombres de archivos y mensajes de commit en **inglés**. Comentarios y documentación en **español**.
- Sin `any`. Si un tipo es difícil, dímelo en vez de esconderlo con `any` o `as`.
- Tile = componente que recibe sus datos por props tipadas. Ningún tile lee `profile.ts` directamente; lo hace `ProfileGrid` y reparte.
- Clases de Tailwind **completas y estáticas** (nada de `` `col-span-${n}` ``; Tailwind no las detecta). Para tamaños usa un mapa `size → clases`.
- Colores y espaciado salen de los tokens de marca (ver skill `brand-design`). Cero colores hexadecimales sueltos en componentes.
- `localStorage` solo para tema, idioma y el borrador del editor (clave `bento.document.v1`), siempre dentro de `try/catch` y con validación al leer.
- Los `href` aceptan solo `http(s)` y `mailto:`; nunca `javascript:` ni `data:`. El editor valida esto al importar y al guardar.
- Un fragmento en otro idioma dentro de un texto lleva atributo `lang`. Los tiles no tienen alturas fijas (`min-h`, nunca `h-*`).

## 6. Reglas de contenido (importante)

- **Todo texto, URL e imagen del perfil vive en `src/content/profile.ts`** (el editor exporta ese mismo archivo); los textos de interfaz (botones, etiquetas, `aria-label`, título de la página) viven en `src/content/ui.ts`. Los componentes no llevan contenido hardcodeado.
- **Todo texto visible o accesible existe en español e inglés.** No se da por terminado un cambio con una traducción faltante. El editor no permite exportar un tile con ES o EN vacío.
- **No inventes nada sobre mí.** Ni cargos, ni fechas, ni tecnologías, ni logros, ni métricas. Si falta un dato, deja un `TODO(nestor):` en `profile.ts` y avísame. Prefiero un tile ausente o marcado con `TODO` a una frase falsa.
- Solo habilidades que domino en la práctica. Si dudas de una, no la pongas.
- Textos en inglés: a mi nivel real, claros, simples y directos. Nada de prosa corporativa inflada.
- Textos en español: neutros y cálidos, sin regionalismos marcados (la web la leerá gente de varios países).

## 7. Flujo de trabajo (SDD)

1. **Spec primero.** No implementes un feature que no tenga spec en `specs/` con criterios de aceptación. Si el pedido no tiene spec, propón una y espera mi OK.
2. **Plan corto antes de código.** Lista los archivos que vas a crear o tocar y el orden. Un plan, no un ensayo.
3. **Cambios pequeños y verificables.** Un criterio de aceptación a la vez; después de cada uno corre los checks que le correspondan.
4. **La spec manda sobre tu criterio.** Si crees que la spec está mal o incompleta, dilo y propón el cambio; no lo resuelvas en silencio por tu cuenta.

## 8. Definition of Done (aplica a todo cambio)

- [ ] `typecheck`, `lint` y `test` pasan
- [ ] Cada criterio de aceptación de la spec tiene una verificación (test o chequeo manual descrito)
- [ ] Responsive probado en 320, 360, 390, 768, 1024, 1280 y 1920 px, sin scroll horizontal
- [ ] Probadas las 4 combinaciones: español/inglés × claro/oscuro
- [ ] Todo texto existe en español e inglés
- [ ] Sin violaciones `serious`/`critical` de axe en las 4 combinaciones de idioma × tema
- [ ] Sin texto o enlace hardcodeado fuera de `profile.ts`
- [ ] Imágenes con `alt`, `width` y `height`
- [ ] Editor: agregar, quitar, ocultar, reordenar y redimensionar persiste tras recargar; reset vuelve al default
- [ ] Import/export: un JSON inválido no pisa el borrador; el `profile.ts` exportado compila
- [ ] El editor se opera con teclado (drag, resize y mover) y el bundle público no lo incluye

## 9. Qué NO hacer

- No agregar backend, CMS, analytics ni cookies sin spec.
- No agregar publicación automática, cuentas ni base de datos para el editor: el flujo es exportar `profile.ts` y hacer deploy.
- No convertir el grid en un lienzo libre con huecos; el layout compacto de 4 columnas es parte de SPEC-003.
- No cargar scripts de terceros al inicio de la página (el reproductor de Spotify se carga bajo demanda).
- No usar librerías de UI pesadas (MUI, Chakra, etc.); Tailwind y componentes propios bastan.
- No reformatear ni reorganizar archivos que no tienen relación con la tarea.
- No tocar `AGENTS.md` ni `specs/` sin que yo lo pida.

## 10. Cómo comunicarte conmigo

- Español, directo, sin rodeos ni relleno. Si algo está mal, dilo y di por qué.
- Cuando tengas dos caminos razonables, preséntame los dos en pocas líneas con tu recomendación.
- Al terminar una tarea: qué cambiaste, qué verificaste y qué quedó pendiente. Nada más.
