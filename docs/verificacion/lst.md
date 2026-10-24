# Trazabilidad: «Lo que cada tarea muestra de su responsable»

Requisito de `openspec/specs/tasks/spec.md`.

**Scenarios del requisito: 3 · Cubiertos: 2** (el 3.º queda en «No lo sé»)

| Scenario | Qué prueba lo cubre | Estado | Si «no lo sé», qué me faltó |
|---|---|---|---|
| 1. Una tarea con responsable «Ada Lovelace» trae su `assignee` con nombre e iniciales | `backend/tests/functional/tasks/assignee.spec.ts`: «Responsable identificable: la tarea suelta trae nombre e iniciales» y «Responsable identificable: la lista trae nombre e iniciales» | Cubierto | |
| 2. Ninguna tarea, suelta o en la lista, trae en su `assignee` el email ni otro dato de acceso | `assignee.spec.ts`: «La tarea no filtra datos de cuenta: la tarea suelta no trae email ni datos de acceso» (verde) y «…: la lista no trae email ni datos de acceso» (**en rojo**: la lista devuelve `email`) | Cubierto | |
| 3. Un responsable registrado sin nombre trae nombre nulo e iniciales | `assignee.spec.ts`: «Responsable sin nombre: la tarea suelta trae nombre nulo e iniciales» y «…: la lista trae nombre nulo e iniciales» | No lo sé | La spec es ambigua: «sin recurrir a su email» no dice de dónde salen las iniciales. El test fija el comportamiento actual del código, que las deriva del email («ada@example.com» → «AE»). |

Antes de estos tests no existía ninguno de tareas: `tests/functional/auth/initials.spec.ts` se llama parecido a los scenarios 1 y 3, pero ejercita `POST /auth/login`, no `/tasks`.

Resultado de la ejecución (`node ace test functional --files=assignee`): 5 verdes, 1 en rojo (el de la lista del scenario 2).

## Las tres líneas

1. **Cuántos creía cubiertos antes de mirar y cuántos lo estaban:** creía  3 de 3  y estaban 2 de 3 al terminar.

2. **Scenario del que no supe si era hueco de test o de spec:** el 3 («Responsable sin nombre»): dice «sin recurrir a su email» pero no dice de dónde salen entonces las iniciales, y el código las deriva del email; es un hueco de spec, y el test fija el comportamiento actual («AE»).

3. **Algo que el scenario no decidía y tuve que decidir al escribir el test:** qué iniciales esperar de «Ada Lovelace» (`AL`) y del responsable sin nombre (`AE`, las del email), y qué claves cuentan como «dato de acceso» (`email`, `password`, `token`, `rememberMeToken`, `accessToken`).


