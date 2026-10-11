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
Otros requisitos del spec; el frontend (la pantalla de la tarea y las filas muestran el responsable y no se testean; el frontend no tiene runner); `POST /tasks` y `PATCH /status`/`PUT /due-date`, que también devuelven tareas (no verificado qué transformer usan); concurrencia (cambio de nombre entre lecturas). Riesgo: una fuga de email por esas otras rutas pasaría sin test. Tampoco se cubre `createdAt`/`updatedAt` en el `assignee`.

## No verificado
`npm test` y `node ace list:routes` fallan al arrancar: `@swc/core` no carga su binario nativo en Windows (una política de control de aplicaciones bloquea `swc.win32-x64-msvc.node`) y `better-sqlite3` es un binario no válido para Win32. No lo eludí. Sí pasan `npm run typecheck` y `npm run lint`.
