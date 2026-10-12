# Matriz de trazabilidad: «Lo que cada tarea muestra de su responsable»

Fuente: `openspec/specs/tasks/spec.md`, requisito «Lo que cada tarea muestra de su responsable».

Vías: tarea suelta = `GET /api/v1/tasks/:id?today=2026-08-13` (exige `today`, si no 422; `TasksController.show` -> `TaskDetailTransformer` -> `TaskAssigneeTransformer`, que expone `id`, `fullName`, `initials`). Lista = `GET /api/v1/tasks` (`TasksController.index` -> `TaskTransformer` -> `UserTransformer`, que expone `id`, `fullName`, `email`, `createdAt`, `updatedAt`, `initials`). El nombre llega como `fullName`, no `name`.

Estado previo: no existía ningún test de tareas. `tests/functional/auth/initials.spec.ts` cubre iniciales en `POST /auth/login`, no la API de tareas, así que no cubre ningún scenario.

IMPORTANTE: los tests NO se han podido ejecutar. `node ace test` ya arranca (`@swc/core` carga), pero cada test falla en el setup con `better_sqlite3.node is not a valid Win32 application` (binario nativo inválido en este equipo; no se reinstaló ni recompiló). Por tanto «CUBIERTO» significa «test escrito que afirma el THEN», no «verificado en verde», y FALLA es por lectura del código y por el tipo generado en `.adonisjs/client/registry`, que ya declara `email` en el `assignee` de la lista. `npm run typecheck` y `npm run lint` sí pasan.

| Scenario | Test que lo cubre (fichero + título) | Veredicto | Qué falta | Ambigüedad |
|---|---|---|---|---|
| Responsable identificable | `backend/tests/functional/tasks/assignee.spec.ts`: «Responsable identificable: la tarea suelta trae nombre e iniciales» y «...: la lista trae nombre e iniciales» (nuevos) | CUBIERTO (suelta y lista; escrito, sin ejecutar) | Antes: todo (SIN TEST). `initials.spec.ts` solo cubre auth. | «sus iniciales» no dice cuáles: se afirma `AL`, derivada de «Ada Lovelace». |
| La tarea no filtra datos de cuenta | `assignee.spec.ts`: «La tarea no filtra datos de cuenta: la tarea suelta no trae email ni datos de acceso» (suelta) y «...: la lista no trae email ni datos de acceso» (lista) | Suelta: CUBIERTO. Lista: FALLA (por lectura de código, sin ejecutar) | Lista: `TaskTransformer` usa `UserTransformer`, que incluye `email` (y `createdAt`/`updatedAt`). Es un bug de código; no corregido (parte 1). | «ningún otro dato de acceso»: ver abajo. |
| Responsable sin nombre | `assignee.spec.ts`: «Responsable sin nombre: la tarea suelta trae nombre nulo e iniciales» y «...: la lista trae nombre nulo e iniciales» | CUBIERTO (escrito, sin ejecutar) | Antes: todo (SIN TEST). | «iniciales siguen llegando» no fija valor: se afirma string no vacío, no `AE`. «sin recurrir a su email» no es comprobable desde la API. |

## Ambigüedades y decisión

- «ningún otro dato de acceso»: se lee como email, `password`, `token`, `rememberMeToken`, `accessToken` (ausencia de clave) y que el email no aparezca en el JSON del `assignee`. Descartada: lista blanca (solo `id`, `fullName`, `initials`) o prohibir `createdAt`/`updatedAt`; el requisito dice «ningún otro dato de esa cuenta», pero el scenario solo habla de acceso, y una lista blanca afirmaría más que el scenario. Riesgo: la fuga de `createdAt`/`updatedAt` por la lista queda sin test.
- Nombre del campo: el spec dice «nombre», la API usa `fullName`; se testea `fullName`.

## Revisión posterior
- Los helpers usaban `client: any`; ahora usan `ApiClient` tipado. Al tiparlo, el typecheck mostró que el cuerpo de la lista declara `assignee.email`, confirmación independiente del FALLA de la lista.
- `enLista` lanza un error explícito si la tarea no está en la lista (antes, un `TypeError` opaco).
- Otras rutas que devuelven `assignee` con `TaskTransformer` (y por tanto con email): `POST /api/v1/tasks` y `PATCH` de estado (`task_statuses_controller`). Sin test: el scenario 2 dice «cualquier tarea». `PUT due-date` usa `TaskDetailTransformer` (limpio).
