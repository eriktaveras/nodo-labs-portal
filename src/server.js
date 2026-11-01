import { crearApp, VERSION } from './app.js';

const puerto = Number(process.env.PORT) || 3000;

crearApp().listen(puerto, () => {
  console.log(`Portal Nodo Labs ${VERSION} escuchando en :${puerto}`);
});
