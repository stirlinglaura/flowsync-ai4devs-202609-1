# Reglas del proyecto

## Estructura del repo

- `backend/`: API en AdonisJS (TypeScript, SQLite vía Lucid). Scripts (`npm run <script>` dentro de `backend/`): `dev`, `build`, `start`, `test`, `lint`, `format`, `typecheck`.
- `frontend/`: SPA en React + Vite (TypeScript). Scripts (`npm run <script>` dentro de `frontend/`): `dev`, `build`, `lint`, `preview`.
- `scripts/publicar-cohorte.sh`: herramienta de gestión de cohortes (crear/publicar ramas en repos de alumnos). No es parte del ciclo de build/test de la app: no lo ejecutes ni lo modifiques salvo que te lo pidan explícitamente, y nunca publiques ramas a mano con `git push` en su lugar.
- `COHORTES.md`: documenta el flujo de `publicar-cohorte.sh`, no la arquitectura de la app.

## Reglas de trabajo - HARNESS

- Antes de modificar código, revisa la estructura y los scripts disponibles (`package.json` de `backend/` y `frontend/`).
- Sigue los nombres, estilos y patrones existentes (convenciones de AdonisJS en `backend/`, de React/Vite en `frontend/`).
- Limita los cambios a lo solicitado.
- No guardes contraseñas, tokens ni claves en el código. Usa `.env` (revisa `.env.example` en `backend/`) y nunca commitees secretos.
- No borres pruebas ni desactives comprobaciones (lint, typecheck, tests) para ocultar errores.
- Comprueba los cambios con los comandos que existan en el proyecto:
  - Backend: `npm run lint`, `npm run typecheck`, `npm test` (en `backend/`).
  - Frontend: `npm run lint`, `npm run build` (en `frontend/`).
- Al finalizar, explica qué cambiaste, qué verificaste y qué quedó pendiente.
- No inventes. Consulta lo que no esté claro o falta información.
- Verifica lo hecho con lo pedido.
- Explica qué quedó pendiente.



PROMPT:
"Agrega un boton que vaya a una pagina donde se de la bienvenida"

//**Resultado con Harness:

Qué cambié:
- frontend/src/Welcome.tsx (nuevo): componente de bienvenida con botón "Volver".
- frontend/src/Welcome.css (nuevo): estilos mínimos, siguiendo el patrón de App.css.
- frontend/src/App.tsx: agregué un botón "Ir a bienvenida" y estado showWelcome (useState) que alterna entre la vista actual y <Welcome />, sin agregar dependencias nuevas.

Verifiqué:
- Instalé dependencias (npm install, faltaba node_modules).
- npm run lint (oxlint) → sin errores.
- npm run build (tsc + vite build) → compila y genera el bundle correctamente.

Pendiente:
- Es navegación por estado local, no por URL (no hay /bienvenida en la barra de direcciones), tal como elegiste.
- No lo probé visualmente en el navegador (npm run dev) — si quieres, lo levanto y confirmo el flujo del botón.
- npm audit reportó 2 vulnerabilidades (1 moderada, 1 alta) en dependencias transitivas del template Vite/oxlint, no relacionadas con este cambio; no las toqué porque no se pidió y podría alterar versiones fuera del alcance solicitado.