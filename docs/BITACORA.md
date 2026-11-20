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
| 2 · Parte 2: `usePlans` | feat(hooks): usePlans | 18 fallan · 39 pasan (usePlans 12/12) | 20 fallan · 37 pasan |
| 3 · Parte 3: `useAgentRun` | feat(hooks): useAgentRun | **0 fallan · 57 pasan** (useAgentRun 18/18) | 20 fallan · 37 pasan |
| 4 · IA fallo 1: `useDebounce` no limpia el temporizador al repetirse | fix(ai): fallo 1 | 0 fallan · 57 pasan | 15 fallan · 42 pasan |
| 5 · IA fallo 2: `usePlans` se traga el error y se queda en loading | fix(ai): fallo 2 | 0 fallan · 57 pasan | 13 fallan · 44 pasan |
| 6 · IA fallo 3: `usePlans` deja que la respuesta vieja pise a la nueva | fix(ai): fallo 3 | 0 fallan · 57 pasan | 9 fallan · 48 pasan |
