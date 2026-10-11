# Matriz de trazabilidad: «Lo que cada tarea muestra de su responsable»

Fuente: `openspec/specs/tasks/spec.md`, requisito «Lo que cada tarea muestra de su responsable».

Vías: tarea suelta = `GET /api/v1/tasks/:id?today=2026-08-13` (exige `today`, si no 422; `TasksController.show` -> `TaskDetailTransformer` -> `TaskAssigneeTransformer`, que expone `id`, `fullName`, `initials`). Lista = `GET /api/v1/tasks` (`TasksController.index` -> `TaskTransformer` -> `UserTransformer`, que expone `id`, `fullName`, `email`, `createdAt`, `updatedAt`, `initials`). El nombre llega como `fullName`, no `name`.

Estado previo: no existía ningún test de tareas. `tests/functional/auth/initials.spec.ts` cubre iniciales en `POST /auth/login`, no la API de tareas, así que no cubre ningún scenario.

IMPORTANTE: en este entorno los tests NO se pudieron ejecutar (ver «No verificado»). Los veredictos FALLA son por lectura del código, no por ejecución.

| Scenario | Test que lo cubre (fichero + título) | Veredicto | Qué falta | Ambigüedad |
|---|---|---|---|---|
| Responsable identificable | `backend/tests/functional/tasks/assignee.spec.ts`: «Responsable identificable: la tarea suelta trae nombre e iniciales» y «...: la lista trae nombre e iniciales» (nuevos) | CUBIERTO (suelta y lista, sin ejecutar) | Antes: todo (SIN TEST). `initials.spec.ts` solo cubre auth. | «sus iniciales» no dice cuáles: se afirma `AL`, derivada de «Ada Lovelace». |
| La tarea no filtra datos de cuenta | `assignee.spec.ts`: «La tarea no filtra datos de cuenta: la tarea suelta no trae email ni datos de acceso» (suelta) y «...: la lista no trae email ni datos de acceso» (lista) | Suelta: CUBIERTO. Lista: FALLA esperado (sin ejecutar) | Lista: `TaskTransformer` usa `UserTransformer`, que incluye `email` (y `createdAt`/`updatedAt`). Es un bug de código; no corregido (parte 1). | «ningún otro dato de acceso»: ver abajo. |
| Responsable sin nombre | `assignee.spec.ts`: «Responsable sin nombre: la tarea suelta trae nombre nulo e iniciales» y «...: la lista trae nombre nulo e iniciales» | CUBIERTO (sin ejecutar) | Antes: todo (SIN TEST). | «iniciales siguen llegando» no fija valor: se afirma string no vacío, no `AE`. «sin recurrir a su email» no es comprobable desde la API. |

## Ambigüedades y decisión

- «ningún otro dato de acceso»: se lee como email, `password`, `token`, `rememberMeToken`, `accessToken` (ausencia de clave) y que el email no aparezca en el JSON del `assignee`. Descartada: lista blanca (solo `id`, `fullName`, `initials`) o prohibir `createdAt`/`updatedAt`; el requisito dice «ningún otro dato de esa cuenta», pero el scenario solo habla de acceso, y una lista blanca afirmaría más que el scenario. Riesgo: la fuga de `createdAt`/`updatedAt` por la lista queda sin test.
- Nombre del campo: el spec dice «nombre», la API usa `fullName`; se testea `fullName`.
