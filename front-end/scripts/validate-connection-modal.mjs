/**
 * Validação real no Chromium (Playwright) do CSS do modal de conexão.
 * Uso: npx playwright test não — script standalone:
 *   node scripts/validate-connection-modal.mjs
 */
import { chromium } from 'playwright';
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const viewports = [
  { name: '1920x1080', width: 1920, height: 1080 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1280x720', width: 1280, height: 720 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '430x932', width: 430, height: 932 },
  { name: '390x844', width: 390, height: 844 },
  { name: '360x800', width: 360, height: 800 },
  { name: '320x568', width: 320, height: 568 },
];

const zooms = [1, 1.25, 1.5, 2];

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function validateViewport(page, vp) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(`http://127.0.0.1:${serverPort}/modal-fixture.html`, { waitUntil: 'networkidle' });

  const result = await page.evaluate(() => {
    const overlay = document.querySelector('.modal-overlay');
    const dialog = document.querySelector('[data-testid="modal-dialog"]');
    const header = document.querySelector('[data-testid="modal-header"]');
    const body = document.querySelector('[data-testid="modal-body"]');
    const footer = document.querySelector('[data-testid="modal-footer"]');
    const closeBtn = document.querySelector('[aria-label="Fechar modal"]');
    const title = document.getElementById('connection-modal-title');

    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const o = overlay.getBoundingClientRect();
    const d = dialog.getBoundingClientRect();
    const h = header.getBoundingClientRect();
    const c = closeBtn.getBoundingClientRect();
    const t = title.getBoundingClientRect();
    const f = footer.getBoundingClientRect();
    const bodyStyle = getComputedStyle(body);
    const overlayStyle = getComputedStyle(overlay);
    const dialogStyle = getComputedStyle(dialog);

    return {
      overlayCovers: o.top <= 1 && o.left <= 1 && o.width >= vw - 2 && o.height >= vh - 2,
      overlayPosition: overlayStyle.position,
      overlayOverflow: overlayStyle.overflow,
      dialogMaxHeight: dialogStyle.maxHeight,
      dialogHeight: d.height,
      dialogTop: d.top,
      dialogBottom: d.bottom,
      headerVisible: h.top >= 0 && h.bottom <= vh && h.height > 0,
      titleVisible: t.top >= 0 && t.bottom <= vh && t.height > 0,
      closeVisible: c.top >= 0 && c.bottom <= vh && c.width >= 40 && c.height >= 40,
      footerVisible: f.top >= 0 && f.bottom <= vh + 1 && f.height > 0,
      bodyScrollable: bodyStyle.overflowY === 'auto' || bodyStyle.overflowY === 'scroll',
      headerNotInBody: !body.contains(header),
      noHorizontalOverflow: document.documentElement.scrollWidth <= vw + 1,
      vh,
      vw,
    };
  });

  assert(result.overlayPosition === 'fixed', `${vp.name}: overlay não é fixed`);
  assert(result.overlayCovers, `${vp.name}: backdrop não cobre viewport`);
  assert(result.headerVisible, `${vp.name}: header fora do viewport (top=${result.dialogTop})`);
  assert(result.titleVisible, `${vp.name}: título fora do viewport`);
  assert(result.closeVisible, `${vp.name}: botão fechar fora do viewport ou < 40x40`);
  assert(result.footerVisible, `${vp.name}: footer fora do viewport`);
  assert(result.bodyScrollable, `${vp.name}: body sem overflow-y auto`);
  assert(result.headerNotInBody, `${vp.name}: header dentro do body scrollável`);
  assert(result.dialogBottom <= result.vh + 2, `${vp.name}: dialog ultrapassa viewport (bottom=${result.dialogBottom}, vh=${result.vh})`);
  assert(result.dialogTop >= -1, `${vp.name}: dialog começa acima do viewport (top=${result.dialogTop})`);
  assert(result.noHorizontalOverflow, `${vp.name}: scroll horizontal`);

  return result;
}

let serverPort = 5179;

async function main() {
  const server = await createServer({
    root,
    server: { port: serverPort, strictPort: true },
    logLevel: 'error',
  });
  await server.listen();
  serverPort = server.config.server.port;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const report = [];

  try {
    for (const vp of viewports) {
      const r = await validateViewport(page, vp);
      report.push({ viewport: vp.name, ok: true, headerTop: Math.round(r.dialogTop), dialogH: Math.round(r.dialogHeight) });
      console.log(`OK ${vp.name} — header visível, dialogH=${Math.round(r.dialogHeight)}`);
    }

    // Zoom checks on critical sizes
    for (const size of [
      { name: '1366x768', width: 1366, height: 768 },
      { name: '320x568', width: 320, height: 568 },
    ]) {
      for (const z of zooms) {
        await page.setViewportSize({ width: size.width, height: size.height });
        await page.goto(`http://127.0.0.1:${serverPort}/modal-fixture.html`, { waitUntil: 'networkidle' });
        await page.evaluate((zoom) => {
          document.body.style.zoom = String(zoom);
        }, z);
        const ok = await page.evaluate(() => {
          const h = document.querySelector('[data-testid="modal-header"]').getBoundingClientRect();
          const c = document.querySelector('[aria-label="Fechar modal"]').getBoundingClientRect();
          return h.top >= 0 && c.top >= 0 && c.bottom <= window.innerHeight + 2;
        });
        assert(ok, `${size.name} zoom ${z * 100}%: header/fechar cortados`);
        console.log(`OK ${size.name} zoom ${z * 100}%`);
      }
      await page.evaluate(() => {
        document.body.style.zoom = '1';
      });
    }

    console.log('\nVALIDACAO_MODAL_OK');
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close();
    await server.close();
  }
}

main().catch((err) => {
  console.error('VALIDACAO_MODAL_FAIL', err.message);
  process.exit(1);
});
