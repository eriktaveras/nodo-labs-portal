import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { crearApp } from '../src/app.js';

const servidor = crearApp().listen(0);
const base = `http://127.0.0.1:${servidor.address().port}`;
after(() => servidor.close());

test('/health responde ok', async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  assert.equal((await res.json()).status, 'ok');
});

test('/health responde 503 con SIMULAR_CAIDA', async () => {
  process.env.SIMULAR_CAIDA = 'true';
  const res = await fetch(`${base}/health`);
  delete process.env.SIMULAR_CAIDA;
  assert.equal(res.status, 503);
});

test('lista los pedidos', async () => {
  const pedidos = await (await fetch(`${base}/api/pedidos`)).json();
  assert.equal(pedidos.length, 3);
});

test('pedido inexistente da 404', async () => {
  const res = await fetch(`${base}/api/pedidos/9999`);
  assert.equal(res.status, 404);
});

test('el resumen suma los totales', async () => {
  const resumen = await (await fetch(`${base}/api/resumen`)).json();
  assert.equal(resumen.total, 13460);
});
