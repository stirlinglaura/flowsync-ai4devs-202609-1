Eres un ingeniero de QA/backend en FlowSync (monorepo; el backend es AdonisJS 7 + Lucid 22 + Japa, y todos los comandos se ejecutan desde `backend/`). Vas a construir una matriz de trazabilidad sobre UN requisito y a cerrar sus huecos de test.

## Alcance
Requisito: «Lo que cada tarea muestra de su responsable», en `openspec/specs/tasks/spec.md`.
Tiene 3 scenarios:
1. Responsable identificable (Ada Lovelace → `assignee` con nombre e iniciales).
2. La tarea no filtra datos de cuenta (`assignee` sin email ni datos de acceso; tarea suelta Y dentro de la lista).
3. Responsable sin nombre (nombre `null`, iniciales presentes).
No toques otros requisitos del spec. Lo de vencimiento (fecha, vencida, `today`) no es de este requisito: no lo afirmes ni lo testees.

## Reglas de proceso (CLAUDE.md)
- Antes de tocar nada: `git checkout -b feat/trazabilidad-assignee`.
- `backend/package.json` ya aparece modificado y no es parte de esta tarea: no lo añadas al commit.
- Al terminar: skill `/commit`. NO abras el PR ni lances ningún subagente: el PR lo abre el usuario.
- Tu respuesta final en el chat es un resumen breve: ruta de la matriz, tests añadidos, qué falló y qué no pudiste verificar.

## PARTE 1 — matriz y tests
Objetivo: matriz scenario → test, y escribir los tests que falten.

1. Lee el requisito y sus scenarios literalmente. No parafrasees los criterios.
2. Descubre cómo se expone hoy el `assignee`: rutas (`node ace list:routes`), controlador, transformer en `app/transformers/` y modelo. No asumas firmas: comprueba el código real. Hay dos vías: `GET /api/v1/tasks` (lista, no pide `today`) y `GET /api/v1/tasks/:id` (tarea suelta). La tarea suelta exige sesión y `today=AAAA-MM-DD`; sin él responde 422 y el test no probaría el `assignee`. Usa `?today=2026-08-13` en esa vía y verifica en el código que es así.
3. Busca tests existentes que toquen estos scenarios (`tests/functional/**`, incluido `auth/initials.spec.ts`, que cubre iniciales a nivel de auth, no de tarea). Un test cubre un scenario solo si ejercita su WHEN y afirma su THEN contra la API de tareas. Que mencione "assignee" o "iniciales" no basta.
4. Produce la matriz en `docs/verificacion/assignee.md` (crea la carpeta si no existe) con columnas:
   Scenario | Test que lo cubre (fichero + título) | Veredicto (CUBIERTO / PARCIAL / SIN TEST / FALLA) | Qué falta | Ambigüedad
   Sé estricto: PARCIAL si solo cubre una de las vías (p. ej. tarea suelta pero no lista).
5. Para cada PARCIAL/SIN TEST escribe el test en `tests/functional/tasks/assignee.spec.ts` (estilo del resto de tests del repo, con el `apiClient` tipado y los helpers de `tests/bootstrap.ts`).
   - Un test por scenario y por vía; el título del test cita el nombre del scenario.
   - Aislamiento: la BD es compartida con el servidor de desarrollo. Usa los hooks de `testUtils.db()` (truncate o transacción global); no dejes estado entre runs.
   Criterio de aserciones:
   - Cada aserción debe poder justificarse con una frase literal del spec; cítala en un comentario encima. No afirmes más ni menos de lo que el spec exige; no uses `deepEqual` sobre todo el objeto por defecto.
   - Scenario 2: comprueba la AUSENCIA de `email` y de otros datos de acceso (p. ej. `password`, `token`), no solo la presencia de nombre e iniciales.
   - Scenario 3: `name` es `null` (no `''` ni `undefined`) e `initials` está presente.
   - Si el spec es ambiguo (p. ej. «ningún otro dato de acceso»), elige la lectura más cercana al texto, escribe el test con ella y anota en la columna «Ambigüedad» la decisión y la alternativa descartada.
6. Ejecuta `npm test`, `npm run typecheck` y `npm run lint`. Si un test nuevo falla, NO lo ajustes para que pase: es un hallazgo (bug de código o spec ambiguo). Márcalo como FALLA. En esta parte no cambies código de producción.

## PARTE 2 — reflexión sobre lo que encontraste en la parte 1
Escribe `docs/verificacion/assignee-reflexion.md` (máximo una página) con:
- Huecos reales vs. huecos de cobertura aparente: ¿qué tests parecían cubrir un scenario y no lo hacían, y por qué?
- Para cada test nuevo, qué mutación del código lo haría fallar (p. ej. añadir `email` al transformer, devolver `''` en vez de `null`). Verifica UNA mutación por test: antes de mutar, comprueba con `git status` que el fichero no tiene cambios previos; aplícala temporalmente, comprueba que el test falla, revierte con `git checkout -- <fichero>` y confirma con `git status` que no queda nada. Las mutaciones son la única excepción a "no tocar producción" y siempre temporales.
- Ambigüedades del spec: qué decisión tomaste, por qué, y qué alternativa descartaste.
- Qué NO cubre esta matriz (otros requisitos, frontend —la pantalla de la tarea también muestra el responsable—, concurrencia) y qué riesgo deja.
- Si algún test falló en la parte 1: diagnóstico y propuesta de arreglo (aplícalo solo si es trivial y está claro que el spec manda).
Antes de `/commit`, `git diff -- app/` debe estar vacío (salvo un arreglo trivial indicado arriba).

## Criterios de calidad
- Cada afirmación de la matriz es comprobable: ruta de fichero y título de test reales.
- No inventes rutas, campos ni helpers; si no existen, créalos mínimamente y dilo.
- No subas la cobertura con tests que no puedan fallar.
