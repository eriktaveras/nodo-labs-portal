import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { crearApp } from '../src/app.js';

const servidor = crearApp().listen(0);
const base = `http://127.0.0.1:${servidor.address().port}`;
after(() => servidor.close());

const guardar = numero => fetch(`${base}/api/tarjetas`, {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ numero })
});

test('guarda la tarjeta y devuelve solo la terminación', async () => {
  const res = await guardar('4111111111111111');
  assert.equal(res.status, 201);
  assert.deepEqual(await res.json(), { guardada: true, terminacion: '1111' });
});

test('rechaza un número inválido', async () => {
  assert.equal((await guardar('1234')).status, 400);
});
