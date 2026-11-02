import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const tileOrder = [
  'identity',
  'linkedin',
  'specialty',
  'experience',
  'spotify',
  'pet',
  'series',
  'hobbies',
];

test('renderiza los tiles obligatorios, encabezados e imágenes', async ({ page }) => {
  await page.goto('/');

  const tiles = page.locator('article[data-tile-id]');
  const avatar = page.locator('[data-profile-avatar]');
  await expect(tiles).toHaveCount(8);
  await expect(avatar).toBeVisible();
  await expect(avatar.locator('img')).toHaveAttribute(
    'alt',
    'Portrait of Nestor Rivas',
  );
  await expect(page.locator('[data-tile-id="identity"] h1')).toHaveText('Nestor Rivas');

  const ids = await tiles.evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute('data-tile-id')),
  );
  expect(ids).toEqual(tileOrder);
  expect(await avatar.evaluate((node) => node.closest('article'))).toBeNull();
  expect(
    await avatar.evaluate((node) => {
      const grid = document.querySelector('[data-profile-grid]');
      return Boolean(grid && node.compareDocumentPosition(grid) & Node.DOCUMENT_POSITION_FOLLOWING);
    }),
  ).toBe(true);

  const headingCount = await tiles.evaluateAll((nodes) =>
    nodes.filter((node) => node.querySelector('h1, h2, h3')).length,
  );
  expect(headingCount).toBe(8);

  await expect(page.locator('img')).toHaveCount(2);
  await expect
    .poll(() =>
      page.locator('img').evaluateAll((images) =>
        (images as HTMLImageElement[]).every(
          (image) => image.complete && image.naturalWidth > 0,
        ),
      ),
    )
    .toBe(true);
});

test('el avatar es circular, mediano y no forma parte del grid', async ({ page }) => {
  await page.goto('/');

  const avatar = page.locator('[data-profile-avatar]');
  const metrics = await avatar.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    return {
      width: rect.width,
      height: rect.height,
      radius: parseFloat(style.borderTopLeftRadius),
    };
  });

  expect(metrics.width).toBe(metrics.height);
  expect(metrics.width).toBeGreaterThanOrEqual(128);
  expect(metrics.width).toBeLessThanOrEqual(160);
  expect(metrics.radius).toBeGreaterThanOrEqual(metrics.width / 2 - 1);
  await expect(page.locator('[data-tile-id="identity"]')).toHaveAttribute('data-size', '1x1');
});

test('todos los enlaces usan protocolos permitidos', async ({ page }) => {
  await page.goto('/');

  const hrefs = await page.locator('a[href]').evaluateAll((anchors) =>
    anchors.map((anchor) => anchor.getAttribute('href') ?? ''),
  );

  expect(hrefs.length).toBeGreaterThan(2);
  for (const href of hrefs) {
    expect(href).toMatch(/^(https?:\/\/|mailto:|#)/);
  }
});

test('identidad y LinkedIn se ven completos en un móvil de 390x844', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  for (const locator of [
    page.locator('[data-profile-avatar]'),
    page.locator('[data-tile-id="identity"]'),
    page.getByRole('link', { name: /LinkedIn/ }),
  ]) {
    const box = await locator.boundingBox();
    if (!box) throw new Error('El elemento no tiene caja visible.');
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(844);
  }
});

test('todos los objetivos interactivos miden al menos 44x44 px', async ({ page }) => {
  for (const width of [320, 360, 390, 768, 1024, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');

    const undersized = await page.locator('a, button').evaluateAll((nodes) =>
      nodes
        .map((node) => {
          const rect = node.getBoundingClientRect();
          return {
            text: (node.getAttribute('aria-label') ?? node.textContent ?? '').trim().slice(0, 40),
            width: rect.width,
            height: rect.height,
          };
        })
        .filter((target) => target.width < 44 || target.height < 44),
    );

    expect(undersized, `objetivos pequeños en ${width}px`).toEqual([]);
  }
});

test('no hay scroll horizontal ni columnas incorrectas de 320 a 1920 px', async ({ page }) => {
  const widths = [320, 360, 390, 768, 1024, 1280, 1920];

  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('[data-profile-grid]')).toBeVisible();

    const result = await page.evaluate(() => {
      const grid = document.querySelector<HTMLElement>('[data-profile-grid]');
      if (!grid) throw new Error('No se encontró el grid.');

      return {
        documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        bodyOverflow: document.body.scrollWidth > document.body.clientWidth,
        columns: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
      };
    });

    expect(result.documentOverflow, `desborde en ${width}px`).toBe(false);
    expect(result.bodyOverflow, `desborde del body en ${width}px`).toBe(false);
    expect(result.columns, `columnas en ${width}px`).toBe(width >= 1024 ? 4 : width >= 640 ? 2 : 1);
  }
});

test('no deja celdas vacías en 2 y 4 columnas', async ({ page }) => {
  for (const width of [640, 768, 1024, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('[data-profile-grid]')).toBeVisible();

    const result = await page.evaluate(() => {
      const grid = document.querySelector<HTMLElement>('[data-profile-grid]');
      if (!grid) throw new Error('No se encontró el grid.');

      const elements = Array.from(
        grid.querySelectorAll<HTMLElement>(':scope > article[data-tile-id]'),
      );
      const gridRect = grid.getBoundingClientRect();
      const gridStyle = getComputedStyle(grid);
      const columns = gridStyle.gridTemplateColumns.split(' ').length;
      const columnGap = parseFloat(gridStyle.columnGap) || 0;
      const columnWidth = (gridRect.width - columnGap * (columns - 1)) / columns;
      const rects = elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
      });
      const rowTops = Array.from(new Set(rects.map((rect) => Math.round(rect.top)))).sort(
        (a, b) => a - b,
      );
      const occupied = new Set<string>();

      for (const rect of rects) {
        const columnStart = Math.round(
          (rect.left - gridRect.left) / (columnWidth + columnGap),
        );
        const rowStart = rowTops.findIndex((top) => Math.abs(top - rect.top) <= 2);
        const columnSpan = Math.max(
          1,
          Math.round((rect.width + columnGap) / (columnWidth + columnGap)),
        );
        const rowSpan = Math.max(
          1,
          rowTops.filter((top) => top >= rect.top - 2 && top < rect.top + rect.height - 2)
            .length,
        );

        if (rowStart < 0) throw new Error('No se pudo ubicar una fila del grid.');

        for (let row = rowStart; row < rowStart + rowSpan; row += 1) {
          for (let column = columnStart; column < columnStart + columnSpan; column += 1) {
            occupied.add(`${row}:${column}`);
          }
        }
      }

      const holes: string[] = [];
      for (let row = 0; row < rowTops.length; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          if (!occupied.has(`${row}:${column}`)) holes.push(`${row}:${column}`);
        }
      }

      return { columns, holes };
    });

    expect(result.columns, `columnas en ${width}px`).toBe(width >= 1024 ? 4 : 2);
    expect(result.holes, `huecos en ${width}px`).toEqual([]);
  }
});

test('aplica el idioma guardado antes del primer render', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('bento.locale', 'es');
  });
  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /Bento personal de Nestor Rivas/,
  );
  await expect(page.getByRole('main', { name: 'Tiles del perfil' })).toBeVisible();
});

test('cambia de idioma y lo conserva al recargar', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: /Spanish/ })).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('button', { name: /English/ })).toHaveAttribute('lang', 'en');
  await page.getByRole('button', { name: /Spanish/ }).click();

  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page).toHaveURL(/\?lang=es/);
  await expect(page.getByRole('main', { name: 'Tiles del perfil' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('bento.locale'))).toBe('es');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('main', { name: 'Tiles del perfil' })).toBeVisible();
});

test('cambia de idioma sin pedir datos al servidor', async ({ page }) => {
  await page.goto('/');
  const requests: string[] = [];
  page.on('request', (request) => {
    if (['document', 'fetch', 'xhr'].includes(request.resourceType())) {
      requests.push(request.url());
    }
  });

  await page.getByRole('button', { name: /Spanish/ }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');

  expect(requests).toEqual([]);
});

test('alterna y persiste el tema claro/oscuro', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await page.evaluate(() => localStorage.getItem('bento.theme'))).toBe('dark');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible();
});

test('respeta prefers-color-scheme cuando el tema es sistema', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await page.evaluate(() => localStorage.getItem('bento.theme'))).toBeNull();
});

test('los enlaces externos se activan con Enter y abren una pestaña nueva', async ({
  page,
  context,
}) => {
  await context.route('https://www.linkedin.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<p>LinkedIn</p>' }),
  );
  await context.route('https://nestor-rivas-portfolio.netlify.app/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<p>Portfolio</p>' }),
  );
  await page.goto('/');

  const linkedin = page.getByRole('link', { name: /LinkedIn/ });
  await expect(linkedin).toHaveAttribute('target', '_blank');
  await expect(linkedin).toHaveAttribute('rel', /noopener/);
  await expect(linkedin).toHaveAttribute('rel', /noreferrer/);

  await linkedin.focus();
  const popupPromise = page.waitForEvent('popup');
  await page.keyboard.press('Enter');
  const popup = await popupPromise;
  await popup.waitForURL(/linkedin\.com\/in\/nestor-rivas/);
  await popup.close();

  const portfolio = page.getByRole('link', { name: /View portfolio/ });
  await expect(portfolio).toHaveAttribute(
    'href',
    'https://nestor-rivas-portfolio.netlify.app/',
  );
  await expect(portfolio).toHaveAttribute('target', '_blank');
  await expect(portfolio).toHaveAttribute('rel', /noopener/);
  await expect(portfolio).toHaveAttribute('rel', /noreferrer/);

  await portfolio.focus();
  const portfolioPopupPromise = page.waitForEvent('popup');
  await page.keyboard.press('Enter');
  const portfolioPopup = await portfolioPopupPromise;
  await portfolioPopup.waitForURL(/nestor-rivas-portfolio\.netlify\.app/);
  await portfolioPopup.close();
});

test('las imágenes declaran prioridad, carga diferida y dimensiones', async ({ page }) => {
  await page.goto('/');

  const portrait = page.getByAltText('Portrait of Nestor Rivas');
  const pet = page.getByAltText('Pet photo');

  await expect(portrait).toHaveAttribute('fetchpriority', 'high');
  await expect(portrait).toHaveAttribute('loading', 'eager');
  await expect(pet).toHaveAttribute('loading', 'lazy');
  await expect(pet).toHaveAttribute('width', '1282');
  await expect(pet).toHaveAttribute('height', '1440');
});

test('el diálogo de trayectoria se opera con teclado y devuelve el foco', async ({ page }) => {
  await page.goto('/');

  const trigger = page.getByRole('button', { name: /View full experience/ });
  await trigger.click();

  const dialog = page.getByRole('dialog', { name: 'Experience' });
  const close = page.getByRole('button', { name: 'Close dialog' });
  await expect(dialog).toBeVisible();
  await expect(close).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(close).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await expect(dialog).toBeVisible();
  await page.mouse.click(4, 4);
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('Spotify no hace peticiones antes del clic y mantiene el enlace', async ({ page }) => {
  const spotifyRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('open.spotify.com')) spotifyRequests.push(request.url());
  });

  await page.goto('/');
  const spotifyLink = page.getByRole('link', { name: /Open in Spotify/ });

  await expect(spotifyLink).toBeVisible();
  expect(spotifyRequests).toEqual([]);

  await page.getByRole('button', { name: 'Play here' }).click();
  const iframe = page.locator('iframe[title="Spotify player"]');
  await expect(iframe).toHaveCount(1);
  await expect(iframe).toBeVisible();
  await expect(iframe).toHaveAttribute('src', /2lkbVzByXcQBg0cEzPS22C/);
  await expect(spotifyLink).toBeVisible();
});

test('no hay violaciones serious/critical de axe en 4 combinaciones', async ({ browser }) => {
  for (const locale of ['es', 'en'] as const) {
    for (const theme of ['light', 'dark'] as const) {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.addInitScript((value) => {
        localStorage.setItem('bento.theme', value);
      }, theme);

      await page.goto(`/?lang=${locale}`);
      await page.getByRole('main').waitFor();

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      const blocking = results.violations.filter(
        (violation) => violation.impact === 'serious' || violation.impact === 'critical',
      );
      expect(blocking, `${locale}/${theme}: ${JSON.stringify(blocking, null, 2)}`).toEqual([]);

      await context.close();
    }
  }
});

