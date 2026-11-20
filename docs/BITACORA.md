# Bitácora del laboratorio extra S11 · Los hooks del agente

Conteo de pruebas (57 en total) después de cada paso. Comandos ejecutados desde la raíz del proyecto.

> Nota de entorno: con Node 26 el `localStorage` nativo de Node tapa al de jsdom y **las 57 pruebas fallan** en
> `src/test/setup.js` (`Cannot read properties of undefined (reading 'clear')`). Como el contrato (`AGENTS.md`) no
> permite tocar `package.json` ni las pruebas, se corre con `NODE_OPTIONS=--no-experimental-webstorage`.
> Con Node 20/22 no hace falta.

| Paso | Commit | `npm test` (src/hooks) | `npm run test:ai` (src/ai) |
|---|---|---|---|
| 0 · Estado inicial de la plantilla | estado original guardado (tag `ia-original`) | 40 fallan · 17 pasan | 20 fallan · 37 pasan |
| 1 · Parte 1: `useDebounce` | feat(hooks): useDebounce | 34 fallan · 23 pasan (useDebounce 10/10) | 20 fallan · 37 pasan |
