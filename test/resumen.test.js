import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { crearApp } from '../src/app.js';

const servidor = crearApp().listen(0);
const base = `http://127.0.0.1:${servidor.address().port}`;
after(() => servidor.close());

test('el resumen cuenta los pedidos pendientes', async () => {
  const resumen = await (await fetch(`${base}/api/resumen`)).json();
  assert.equal(resumen.pendientes, 2);
});
