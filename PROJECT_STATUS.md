# Estado del proyecto

**Proyecto:** Bento personal de Nestor Rivas
**Última actualización:** 2 de noviembre de 2026
**Fase:** prototipo funcional, listo para revisión y deploy
**Demo publicada:** todavía no
**Repositorio Git:** [rotsenk/benbento](https://github.com/rotsenk/benbento) (público)

---

## Resumen ejecutivo

La página pública está implementada y validada: renderiza el grid, funciona en español e inglés, respeta el tema claro/oscuro/sistema, cumple los objetivos de accesibilidad y rendimiento, y no tiene dependencias vulnerables conocidas.

El contenido real ya está cargado, las imágenes se sirven en WebP y la foto de perfil se separó del grid como avatar circular. El código ya está en un repositorio público; la demo sigue pendiente, igual que definir licencia, conectar CI e implementar el editor local de SPEC-003.

| Área | Estado | Nota |
|---|---|---|
| Página pública | Funcional | Avatar + 8 tiles del grid activos y 5 sugeridos implementados |
| SPEC-001 | Funcionalmente cerrada | Contenido real e imágenes WebP cargadas |
| SPEC-002 | Base implementada | Faltan pruebas formales de algunos criterios |
| SPEC-003 | No iniciada | Solo existen modelo y reducer; no hay editor ni `@dnd-kit` |
| Responsive | Validado | 320, 360, 390, 768, 1024, 1280 y 1920 px |
| Accesibilidad | Validada | 0 violaciones axe `serious`/`critical` en 4 combinaciones |
| Rendimiento | Objetivo cumplido | Lighthouse móvil 96/100/100; LCP 2.5 s |
| Seguridad de dependencias | Limpia | `npm audit`: 0 vulnerabilidades |
| Tests | En verde | 36 unitarios/componentes + 34 E2E |
| Deploy | Pendiente | Sin URL pública ni CI |
| Git | Publicado | Repositorio público; sin CI |
| Licencia | Sin definir | No se incluye licencia de uso |

---

## Puntos alcanzados

### Producto

- Grid responsive mobile-first de 1, 2 y 4 columnas, sin scroll horizontal y sin celdas vacías en 2/4 columnas.
- Avatar circular fuera del grid (128 px móvil, 160 px desktop) y ocho tiles publicados dentro: identidad, LinkedIn, especialidad con enlace al portafolio, experiencia, Spotify, mascota, series y hobbies.
- Cinco tiles sugeridos implementados: proyectos, GitHub, contacto, “ahora” y disponibilidad.
- Resumen de trayectoria con diálogo accesible para la versión completa.
- Tile de Spotify con fachada: no carga el iframe ni contacta a Spotify hasta el clic.
- Tema claro, oscuro y sistema, persistente y sin parpadeo inicial.
- Selector ES/EN con textos de interfaz, contenido, título, descripción y `lang` sincronizados.
- Enlaces externos seguros: solo `http(s)` y `mailto:`; los inválidos se rechazan.
- Imágenes con `alt`, dimensiones y política de carga; la foto principal usa prioridad alta.

### Técnico

- React 18 + TypeScript estricto, sin `any`.
- Vite 8, plugin de React 6, Vitest 5 y Playwright 1.64.
- Tailwind CSS 4 con tokens de marca y clases estáticas.
- i18n propio y ligero, sin `react-i18next`.
- Resolución de idioma antes del primer render mediante script inline en `index.html`:
  `?lang` → `localStorage` → `navigator.language` → inglés.
- Persistencia de tema e idioma con claves versionadas y manejo de `localStorage` bloqueado.
- Redux Toolkit reservado para UI; documento del perfil en Context + `useReducer`.
- Sin router, backend, login, CMS, analytics ni cookies.
- Fuentes autoalojadas con subconjuntos `latin` y `latin-ext`, además de fallback con métricas ajustadas.
- Build separado en runtime, vendor, iconos y app; JS inicial aproximado de 74 KB gzip y CSS de 6.3 KB gzip.
- `.gitignore` preparado para excluir `node_modules`, `dist`, reportes de tests y archivos locales.

### Calidad

- `typecheck`, `lint`, tests, build y E2E en verde.
- 36 tests unitarios/componentes en 7 archivos.
- 34 tests E2E: 17 escenarios en Chromium desktop y 17 en WebKit con viewport iPhone 13.
- Cobertura de avatar, idioma, tema, responsive, ausencia de huecos, enlaces, portafolio en Especialidad, imágenes, diálogo, Spotify, axe, contacto y tiles sugeridos.
- Lighthouse móvil local sobre el build de producción:
  - Performance: **96**
  - Accessibility: **100**
  - Best Practices: **100**
  - FCP: **1.3 s**
  - LCP: **2.5 s**
  - CLS: **0**
  - TBT: **130 ms**
- `npm audit`: **0** vulnerabilidades en la última auditoría; sin cambios de dependencias desde entonces.
- Documentación base creada: `README.md`, `PROJECT_STATUS.md`, specs y convenciones.

---

## Decisiones tomadas

1. **Avatar fuera del grid e identidad compacta.**
   La foto de perfil es un tile `avatar` independiente que se renderiza como círculo antes de la cuadrícula; `identity` queda en 1x1 con nombre, headline y bio. Dentro del grid, LinkedIn es 1x1 y la mascota pasa de 1x2 en móvil a 2x1 en tablet/desktop. No se usa `grid-flow-row-dense`; el orden DOM se mantiene y no quedan huecos.

2. **Idioma antes del pintado.**
   El script inline de `index.html` aplica `lang`, título y descripción según URL, preferencia local y navegador. Después, React mantiene el mismo estado. Esto evita el parpadeo de idioma, pero duplica los textos de título/descripción entre `index.html` y `ui.ts`.

3. **Sin backend ni router.**
   La publicación es estática. El idioma viaja en `?lang=` y se actualiza con `history.replaceState`. No hay rutas por idioma ni persistencia remota.

4. **Spotify como fachada.**
   El iframe se crea solo tras una acción explícita; así no se carga un script de terceros al inicio ni se compromete el rendimiento móvil.

5. **Contenido separado de UI.**
   `profile.ts` contiene el perfil; `ui.ts`, la interfaz. Los tiles reciben textos resueltos y no leen contenido global.

6. **El editor queda para después.**
   `profileReducer` ya contempla `add`, `remove`, `toggle`, `resize`, `reorder` y `update`, pero no hay UI, persistencia `bento.document.v1`, import/export ni drag & drop. `/?edit=1` no abre ningún editor todavía.

---

## Pendientes

### P0 — Contenido real

- [x] Reemplazar los **20** `TODO(nestor)` de `src/content/profile.ts`.
- [x] Sustituir `profile-placeholder.webp` y `pet-placeholder.webp` por fotos reales.
- [x] Verificar la URL exacta de LinkedIn.
- [x] Confirmar playlist de Spotify, series, hobbies e institución/empresa de la trayectoria.
- [x] Escribir la bio definitiva y el pie de foto de la mascota en ES y EN.
- [x] Actualizar `alt`, `width` y `height` según las imágenes finales.
- [x] Añadir el enlace al portafolio dentro del tile Especialidad, en ES/EN y con apertura segura.
- [x] Revisar que no se publique ningún texto provisional.

### P1 — Cierre formal de SPEC-002

- [ ] Añadir pruebas Playwright con contextos `es-SV`, `en-US` y `fr-FR`.
- [ ] Cubrir título, meta descripción y texto visible de todos los tiles antes/después del cambio.
- [ ] Verificar que el cambio de idioma no crea entradas de historial y que los enlaces directos con `?lang=` funcionan.
- [ ] Añadir una prueba de completitud que detecte claves `Localized` vacías o ausentes.
- [ ] Medir el idioma en `DOMContentLoaded` y el CLS durante el cambio de idioma.
- [ ] Probar el selector solo con teclado y comprobar el anuncio en `aria-live`.

### P2 — Publicación y repositorio

- [x] Optimizar `me-nestor.png` y `meandpuppy.jpg` a `.webp` y ajustar `width`/`height`.
- [x] Mover a `design-assets/images/` los originales y archivos redundantes (`me-nestor.png`, `meandpuppy.jpg`, `meandpuppie.webp`, `pet-placeholder.webp`).
- [x] Inicializar Git, crear el primer commit y publicar el repositorio público en GitHub.
- [ ] Publicar una demo en hosting estático desde la raíz del dominio.
- [ ] Añadir la URL de la demo al README.
- [ ] Configurar CI para typecheck, lint, tests, build y E2E.
- [ ] Decidir licencia y política de uso del contenido personal.
- [ ] Añadir imagen social/Open Graph y favicon definitivo si se publica.
- [ ] Añadir un preview visual real al README cuando el contenido esté listo.

### P3 — Editor local (SPEC-003)

- [ ] Crear `src/features/editor` y cargarlo con `React.lazy()` solo en `?edit=1`.
- [ ] Instalar y cargar `@dnd-kit/core`, `@dnd-kit/sortable` y `@dnd-kit/utilities` solo en el editor.
- [ ] Implementar panel, formularios bilingües, alta/baja/ocultar, reordenar y redimensionar.
- [ ] Persistir el borrador en `bento.document.v1` y validarlo al leer.
- [ ] Implementar import/export JSON y exportación de `profile.ts`.
- [ ] Garantizar operación completa con teclado y que el bundle público no incluya el editor.

---

## Riesgos y notas

- **Originales fuera del deploy:** los PNG/JPG y variantes antiguas viven en `design-assets/images/`; solo `public/images/me-nestor.webp` y `meandpuppy.webp` se sirven. La carpeta de originales no entra en `dist/`.
- **Doble fuente de metadatos:** si cambia el título o la descripción en `ui.ts`, hay que actualizar el script inline de `index.html`.
- **Preload del avatar:** `index.html` precarga `/images/me-nestor.webp` para el LCP; si cambia la foto en `profile.ts`, actualiza también esa ruta y el `href` del preload.
- **Layout del avatar:** el avatar vive fuera del grid; si se reordena el array de `tiles`, su posición visual no cambia. Es intencional y está documentado en SPEC-001.
- **E2E sobre build:** `npm run e2e` sirve el `dist/` existente. Después de cambiar código hay que ejecutar `npm run build` primero.
- **Sin regresión visual automatizada:** no hay comparación de capturas; la validación actual es DOM, responsive y axe.
- **Tiles sugeridos:** están implementados y cubiertos por tests unitarios, pero no aparecen en el perfil público ni tienen E2E propio.
- **Sin licencia:** el repositorio no define condiciones de reutilización.

---

## Verificación reproducible

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run e2e
npm audit
```

| Comando | Resultado actual |
|---|---|
| `npm run typecheck` | Pasa |
| `npm run lint` | Pasa, 0 warnings |
| `npm run test` | 36 tests en 7 archivos |
| `npm run build` | Pasa; JS inicial ≈ 74 KB gzip; CSS ≈ 6.3 KB |
| `npm run e2e` | 34 tests en Chromium + WebKit móvil |
| `npm audit` | 0 vulnerabilidades |
| Lighthouse | 96/100/100; LCP 2.5 s; CLS 0; TBT 130 ms |

Las métricas de Lighthouse son de laboratorio, sobre `vite preview` local, y pueden variar en el hosting final.

---

## Criterio de terminado del prototipo

- [x] Página pública responsive de 320 a 1920 px sin scroll horizontal.
- [x] Avatar fuera del grid y 8 tiles obligatorios del grid renderizados.
- [x] Español e inglés en las 4 combinaciones de idioma × tema.
- [x] 0 violaciones axe `serious`/`critical` en las combinaciones probadas.
- [x] Spotify sin carga de terceros antes del clic.
- [x] `typecheck`, `lint`, tests, build y E2E en verde.
- [x] Dependencias sin vulnerabilidades conocidas.
- [x] Contenido real y fotos cargadas.
- [x] Imágenes optimizadas a WebP.
- [x] Archivos originales/redundantes fuera de `public/images`.
- [ ] Demo publicada y URL en el README.
- [ ] Editor local de SPEC-003.
- [ ] Licencia definida.
