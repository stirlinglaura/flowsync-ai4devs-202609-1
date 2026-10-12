# Reflexión: responsable de la tarea

## Huecos reales vs. cobertura aparente
Aparente: `tests/functional/auth/initials.spec.ts` parece cubrir «Responsable identificable» y «sin nombre» (Ada Lovelace -> `AL`, `null`), pero ejercita `POST /auth/login` y `UserTransformer` del perfil. Ninguna petición llega a `/tasks`, así que no prueba el `assignee` de una tarea. No había ningún test de tareas: los 3 scenarios eran huecos reales en ambas vías.

## Mutaciones (una por test)
NO VERIFICADAS: no pude ejecutar los tests (ver abajo), así que no apliqué mutaciones. Mutación que haría fallar cada test, solo por análisis:
- Identificable (suelta): quitar `fullName` o `initials` de `TaskAssigneeTransformer.pick`. (lista): lo mismo en `UserTransformer`.
- No filtra (suelta): añadir `'email'` a `TaskAssigneeTransformer.pick`. (lista): ya falla hoy sin mutar.
- Sin nombre (suelta/lista): serializar `fullName ?? ''` en el transformer; o quitar `initials`.

## Falla esperado y propuesta
Lista, «La tarea no filtra datos de cuenta»: `TaskTransformer` usa `UserTransformer` (con `email`). Arreglo propuesto, no aplicado: usar `TaskAssigneeTransformer` en `TaskTransformer`. Es de una línea y el spec manda, pero como no puedo ejecutar los tests no lo apliqué a ciegas. Además el comentario de `TaskAssigneeTransformer` dice que la lista no recibe el email; el código lo contradice.

## Qué NO cubre
Otros requisitos del spec; el frontend (la pantalla de la tarea y las filas muestran el responsable y no se testean; el frontend no tiene runner); `POST /tasks` y el cambio de estado, que devuelven `TaskTransformer` (leen el código: mismo fallo de email que la lista) y no tienen test; `PUT due-date` usa `TaskDetailTransformer`; concurrencia (cambio de nombre entre lecturas). Riesgo: una fuga de email por esas otras rutas pasaría sin test. Tampoco se cubre `createdAt`/`updatedAt` en el `assignee`.

## No verificado
`npm test` arranca (`@swc/core` ya carga) pero los 6 tests fallan en el setup: `better_sqlite3.node is not a valid Win32 application`. No lo recompilé ni reinstalé, por indicación expresa. Consecuencias: ningún test se ha visto en verde ni en rojo, y las mutaciones (una por test) no se han podido verificar; son solo análisis. `npm run typecheck` y `npm run lint` sí pasan.
