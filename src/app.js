import express from 'express';

export const VERSION = process.env.APP_VERSION || 'dev';

const pedidos = [
  { id: 1001, cliente: 'Ferretería Duarte', total: 4850, estado: 'entregado' },
  { id: 1002, cliente: 'Colmado La Esquina', total: 1290, estado: 'en camino' },
  { id: 1003, cliente: 'Farmacia Central', total: 7320, estado: 'pendiente' }
];

export function crearApp() {
  const app = express();
  app.use(express.json());

  // SIMULAR_CAIDA se lee en cada request para poder tumbar el servicio en vivo sin redeploy.
  app.get('/health', (req, res) => {
    if (process.env.SIMULAR_CAIDA === 'true') {
      return res.status(503).json({ status: 'caido', version: VERSION });
    }
    res.json({ status: 'ok', version: VERSION });
  });

  app.get('/api/pedidos', (req, res) => {
    res.json(pedidos);
  });

  app.get('/api/pedidos/:id', (req, res) => {
    const pedido = pedidos.find(p => p.id === Number(req.params.id));
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(pedido);
  });

  app.post('/api/tarjetas', (req, res) => {
    const numero = String(req.body?.numero || '');
    if (!/^\d{16}$/.test(numero)) return res.status(400).json({ error: 'Número de tarjeta inválido' });
    res.status(201).json({ guardada: true, terminacion: numero.slice(-4) });
  });

  app.get('/api/resumen', (req, res) => {
    const total = pedidos.reduce((suma, p) => suma + p.total, 0);
    const pendientes = pedidos.filter(p => p.estado !== 'entregado').length;
    res.json({ pedidos: pedidos.length, pendientes, total, moneda: 'DOP' });
  });

  return app;
}
