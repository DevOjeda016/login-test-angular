// Genera las animaciones Lottie del hero del login en public/lottie/*.json.
// Los íconos son blancos y sin fondo: el color de cada módulo lo pone el chip CSS (--module-*).
// Uso: node scripts/generate-lottie.mjs
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT = new URL('../public/lottie/', import.meta.url);
const WHITE = [1, 1, 1, 1];
const FPS = 30;
const OP = 90;

const EASE = { i: { x: 0.58, y: 1 }, o: { x: 0.42, y: 0 } };
const LINEAR = { i: { x: 1, y: 1 }, o: { x: 0, y: 0 } };
const EASE_IN = { i: { x: 0.9, y: 1 }, o: { x: 0.5, y: 0 } };

const prop = (k) => ({ a: 0, k });
const asProp = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : prop(v));

/** Keyframes: [[frame, value, easing?], ...]. */
function kf(frames, easing = EASE) {
  const dims = Array.isArray(frames[0][1]) ? frames[0][1].length : 1;
  const fill = (n) => Array(dims).fill(n);
  return {
    a: 1,
    k: frames.map(([t, v, e], idx) => {
      const s = Array.isArray(v) ? v : [v];
      if (idx === frames.length - 1) return { t, s };
      const ez = e ?? easing;
      return { t, s, i: { x: fill(ez.i.x), y: fill(ez.i.y) }, o: { x: fill(ez.o.x), y: fill(ez.o.y) } };
    }),
  };
}

let layerIndex = 0;
const layer = (nm, shapes, k = {}) => {
  const { p = [48, 48, 0], a = [0, 0, 0], s = [100, 100, 100], r = 0, o = 100 } = k;
  return {
    ddd: 0, ind: ++layerIndex, ty: 4, nm, sr: 1,
    ks: { o: asProp(o), r: asProp(r), p: asProp(p), a: asProp(a), s: asProp(s) },
    ao: 0, shapes, ip: 0, op: OP, st: 0, bm: 0,
  };
};

const tr = ({ p = [0, 0], s = [100, 100], r = 0, o = 100 } = {}) => ({
  ty: 'tr', p: asProp(p), a: prop([0, 0]), s: asProp(s), r: asProp(r), o: asProp(o), sk: prop(0), sa: prop(0),
});
const grp = (nm, items, t) => ({ ty: 'gr', nm, it: [...items, tr(t)], np: items.length, cix: 2, bm: 0, ix: 1, mn: '', hd: false });

const ell = (w, h = w, p = [0, 0]) => ({ ty: 'el', d: 1, s: prop([w, h]), p: prop(p), nm: 'ellipse' });
const rc = (w, h, r, p = [0, 0]) => ({ ty: 'rc', d: 1, s: prop([w, h]), p: prop(p), r: prop(r), nm: 'rect' });
const stroke = (w, o = 100) => ({ ty: 'st', c: prop(WHITE), o: prop(o), w: prop(w), lc: 2, lj: 2, ml: 4, nm: 'stroke' });
const fill = (o = 100) => ({ ty: 'fl', c: prop(WHITE), o: prop(o), r: 1, nm: 'fill' });
const trim = (e, s = 0) => ({ ty: 'tm', s: asProp(s), e: asProp(e), o: prop(0), m: 1, nm: 'trim' });

/** Path through points; `smooth` derives Catmull-Rom style tangents. */
function pth(pts, { closed = false, smooth = false } = {}) {
  const o = [], i = [];
  pts.forEach((pt, n) => {
    if (!smooth) { o.push([0, 0]); i.push([0, 0]); return; }
    const prev = pts[n - 1] ?? pt;
    const next = pts[n + 1] ?? pt;
    const t = [(next[0] - prev[0]) / 6, (next[1] - prev[1]) / 6];
    o.push(t);
    i.push([-t[0], -t[1]]);
  });
  return { ty: 'sh', ks: prop({ i, o, v: pts, c: closed }), nm: 'path' };
}

const lottie = (nm, layers, size = 96, op = OP) => ({
  v: '5.7.4', fr: FPS, ip: 0, op, w: size, h: size, nm, ddd: 0, assets: [], layers,
});

const star = (r = 6, n = 1.6) =>
  pth([[0, -r], [n, -n], [r, 0], [n, n], [0, r], [-n, n], [-r, 0], [-n, -n]], { closed: true });

const pop = (from, to, peak = 100) =>
  kf([[0, [0, 0, 100]], [from, [0, 0, 100]], [(from + to) / 2, [peak, peak, 100]], [to, [0, 0, 100]], [OP, [0, 0, 100]]]);

const hold = (v) => [v, v, v];
const out = {};

// Préstamos: moneda con "$" que gira dos veces.
out.prestamos = lottie('prestamos', [
  layer('coin', [
    grp('anillo', [ell(52), stroke(5)]),
    grp('interior', [ell(40), stroke(2, 55)]),
    grp('signo', [
      pth([[7, -8], [2, -12], [-4, -11], [-8, -6], [-5, -2], [0, 0], [5, 3], [8, 7], [4, 12], [-2, 12], [-7, 8]], { smooth: true }),
      stroke(4),
    ]),
    grp('ticks', [pth([[0, -17], [0, -12]]), pth([[0, 12], [0, 17]]), stroke(3.5)]),
  ], {
    p: kf([[0, [48, 48, 0]], [18, [48, 38, 0]], [36, [48, 48, 0]], [45, [48, 48, 0]], [63, [48, 38, 0]], [81, [48, 48, 0]], [90, [48, 48, 0]]]),
    s: kf([[0, hold(100)], [18, [0, 100, 100]], [36, hold(100)], [45, hold(100)], [63, [0, 100, 100]], [81, hold(100)], [90, hold(100)]]),
  }),
]);

// Anticipo de nómina: billete que flota sobre otro.
out.nomina = lottie('nomina', [
  layer('billete', [
    grp('cuerpo', [rc(60, 36, 7), stroke(5)]),
    grp('centro', [ell(14), stroke(4)]),
    grp('punto-izq', [ell(5, 5, [-21, 0]), fill()]),
    grp('punto-der', [ell(5, 5, [21, 0]), fill()]),
  ], {
    p: kf([[0, [44, 54, 0]], [30, [44, 48, 0]], [60, [44, 54, 0]], [90, [44, 54, 0]]]),
    r: kf([[0, -4], [45, 4], [90, -4]]),
  }),
  layer('atras', [grp('borde', [pth([[-22, -26], [38, -26], [38, 10]]), stroke(5, 55)])], { p: [44, 54, 0] }),
]);

// Prima vacacional: sol con rayos que giran sobre una ola.
out.prima = lottie('prima', [
  layer('rayos', Array.from({ length: 8 }, (_, k) =>
    grp(`rayo-${k}`, [pth([[0, -21], [0, -28]]), stroke(5)], { r: 45 * k })),
  { p: [48, 38, 0], r: kf([[0, 0], [90, 45]], LINEAR) }),
  layer('sol', [grp('nucleo', [ell(26), stroke(5)])], {
    p: [48, 38, 0],
    s: kf([[0, hold(100)], [45, hold(110)], [90, hold(100)]]),
  }),
  layer('ola', [grp('ola', [pth([[-30, 0], [-15, -6], [0, 0], [15, 6], [30, 0]], { smooth: true }), stroke(5)])], {
    p: kf([[0, [48, 82, 0]], [45, [48, 79, 0]], [90, [48, 82, 0]]]),
  }),
]);

// Fondo de ahorro: moneda que cae en un frasco.
out.ahorro = lottie('ahorro', [
  layer('moneda', [grp('moneda', [ell(18), stroke(4)])], {
    p: kf([[0, [48, 8, 0]], [28, [48, 36, 0]], [90, [48, 36, 0]]], EASE_IN),
    o: kf([[0, 0], [6, 100], [26, 100], [32, 0], [90, 0]], LINEAR),
    s: kf([[0, hold(100)], [26, hold(100)], [32, hold(60)], [90, hold(60)]], LINEAR),
  }),
  layer('frasco', [
    grp('cuerpo', [rc(44, 38, 10, [0, 14]), stroke(5)]),
    grp('tapa', [pth([[-26, -8], [26, -8]]), stroke(5)]),
  ], {
    a: [0, 30, 0],
    p: [48, 74, 0],
    s: kf([[0, hold(100)], [30, hold(100)], [34, [100, 93, 100]], [46, hold(100)], [90, hold(100)]]),
  }),
]);

// Horas extraordinarias: reloj con manecillas y un "+".
out.horas = lottie('horas', [
  layer('mas', [
    grp('h', [pth([[-7, 0], [7, 0]]), stroke(4.5)]),
    grp('v', [pth([[0, -7], [0, 7]]), stroke(4.5)]),
  ], { p: [76, 20, 0], s: kf([[0, hold(100)], [20, hold(130)], [40, hold(100)], [90, hold(100)]]) }),
  layer('minutero', [grp('m', [pth([[0, 0], [0, -17]]), stroke(5)])], {
    p: [44, 52, 0], r: kf([[0, 0], [90, 360]], LINEAR),
  }),
  layer('horario', [grp('h', [pth([[0, 0], [0, -11]]), stroke(5)])], {
    p: [44, 52, 0], r: kf([[0, 0], [90, 30]], LINEAR),
  }),
  layer('centro', [grp('c', [ell(6), fill()])], { p: [44, 52, 0] }),
  layer('esfera', [grp('e', [ell(50), stroke(5)])], { p: [44, 52, 0] }),
]);

// Convenios: documento que se firma y se marca como válido.
out.convenios = lottie('convenios', [
  layer('contenido', [
    grp('l1', [pth([[-12, -14], [12, -14]]), trim(kf([[6, 0], [20, 100], [90, 100]])), stroke(4.5)]),
    grp('l2', [pth([[-12, -4], [12, -4]]), trim(kf([[16, 0], [30, 100], [90, 100]])), stroke(4.5)]),
    grp('l3', [pth([[-12, 6], [0, 6]]), trim(kf([[26, 0], [38, 100], [90, 100]])), stroke(4.5)]),
    grp('check', [pth([[-9, 18], [-2, 25], [10, 11]]), trim(kf([[40, 0], [52, 100], [90, 100]])), stroke(5)]),
  ], { p: [48, 46, 0], o: kf([[0, 100], [76, 100], [86, 0], [90, 0]], LINEAR) }),
  layer('documento', [grp('doc', [rc(44, 58, 8), stroke(5)])], { p: [48, 46, 0] }),
]);

// Beneficios: regalo que abre la tapa con destellos.
out.beneficios = lottie('beneficios', [
  layer('destello-1', [grp('s', [star(7), fill()])], { p: [20, 30, 0], s: pop(18, 44) }),
  layer('destello-2', [grp('s', [star(6), fill()])], { p: [76, 38, 0], s: pop(24, 50) }),
  layer('destello-3', [grp('s', [star(5), fill()])], { p: [68, 14, 0], s: pop(14, 38) }),
  layer('tapa', [
    grp('tapa', [rc(46, 12, 4), stroke(5)]),
    grp('cinta', [pth([[0, -6], [0, 6]]), stroke(5)]),
    grp('lazo-izq', [ell(14, 14, [-8, -17]), stroke(4)]),
    grp('lazo-der', [ell(14, 14, [8, -17]), stroke(4)]),
  ], {
    p: kf([[0, [48, 47, 0]], [14, [48, 47, 0]], [24, [48, 36, 0]], [34, [48, 47, 0]], [90, [48, 47, 0]]]),
    r: kf([[0, 0], [14, 0], [24, -6], [34, 0], [90, 0]]),
  }),
  layer('caja', [
    grp('cuerpo', [rc(38, 26, 4), stroke(5)]),
    grp('cinta', [pth([[0, -13], [0, 13]]), stroke(5)]),
  ], { p: [48, 67, 0] }),
]);

// Capa ambiental: destellos que parpadean sobre la imagen.
const SPARKS = [[70, 90, 0, 1.8], [330, 70, 25, 1.2], [200, 150, 50, 2.2], [60, 250, 70, 1.4], [340, 290, 15, 2], [150, 360, 40, 1.1], [280, 200, 85, 1.5]];
out.destellos = lottie('destellos', SPARKS.map(([x, y, t0, sc], n) => {
  const peak = Math.round(sc * 100);
  return layer(`destello-${n}`, [grp('s', [star(8, 2), fill(90)])], {
    p: [x, y, 0],
    s: kf([[0, [0, 0, 100]], [t0, [0, 0, 100]], [t0 + 20, [peak, peak, 100]], [t0 + 40, [0, 0, 100]], [120, [0, 0, 100]]]),
    r: kf([[0, 0], [120, 90]], LINEAR),
  });
}), 400, 120);

mkdirSync(OUT, { recursive: true });
for (const [name, data] of Object.entries(out)) {
  writeFileSync(new URL(`${name}.json`, OUT), JSON.stringify(data));
  console.log(`public/lottie/${name}.json`);
}
