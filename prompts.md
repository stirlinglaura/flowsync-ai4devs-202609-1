# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

Borra el ejemplo de abajo cuando escribas el primero.

---

## Prompt 1

**Modelo:** Opus 1M xHigh
**Herramienta:** Claude Code

```
Este es el ejemplo. Bórralo.

El prompt va aquí dentro, entero y con sus saltos de línea,
para que se sepa dónde empieza y dónde acaba.
```

**Qué salió:** (opcional, una línea) funcionó a la primera / tuve que insistir / me inventó una ruta que no existe.




**prompts s4 sonnet 5.5 M

crea un prompt para un agente tal que trabajar sobre el requisito «Lo que cada tarea muestra de su responsable», que está en openspec/specs/tasks/spec.md — el mismo sobre el que trabajará el mentor en el directo. Lo intentas tú primero, con tus propios prompts. El objetivo es construir una matriz de trazabilidad: revisar, scenario a scenario, si cada uno tiene un test que lo cubre, y escribir los que falten. Son dos partes: la primera con el reloj puesto, la segunda sin él para reflexionar sobre lo que encontraste.  


prompts.md
crea un prompt para un agente tal que trabajar sobre el requisito «Lo que cada tarea muestra de su responsable», que está en openspec/specs/tasks/spec.md — el mismo sobre el que trabajará el mentor en el directo. Lo intentas tú primero, con tus propios prompts. El objetivo es construir una matriz de trazabilidad: revisar, scenario a scenario, si cada uno tiene un test que lo cubre, y escribir los que falten. Son dos partes: la primera con el reloj puesto, la segunda sin él para reflexionar sobre lo que encontraste.
Show more
Grep "Lo que cada tarea muestra de su responsable" (in c:\Users\stlau\Documents\LIdr4Dev\flowsync-ai4devs-202609-1\openspec\specs\tasks\spec.md)
41 lines of output
Read c:\Users\stlau\Documents\LIdr4Dev\flowsync-ai4devs-202609-1\prompts.md
Globpattern: "backend/tests/**/*.ts"
Found 5 files
3:15 PM
Este es el prompt, listo para pegar en un agente nuevo. Ya tiene el requisito, los tres scenarios y el estado de los tests (solo existe tests/functional/auth/, y tasks no tiene ninguno).


Eres un ingeniero de QA/backend en FlowSync (monorepo; el backend es AdonisJS 7 + Lucid 22 + Japa, y todos los comandos se ejecutan desde `backend/`). Vas a construir una matriz de trazabilidad sobre UN requisito y a cerrar sus huecos de test.

## Alcance
Requisito: «Lo que cada tarea muestra de su responsable», en `openspec/specs/tasks/spec.md`.
Tiene 3 scenarios:
1. Responsable identificable (Ada Lovelace → `assignee` con nombre e iniciales).
2. La tarea no filtra datos de cuenta (`assignee` sin email ni datos de acceso; tarea suelta Y dentro de la lista).
3. Responsable sin nombre (nombre `null`, iniciales presentes).
No toques otros requisitos del spec.

## Reglas de proceso (CLAUDE.md)
- Antes de tocar nada: `git checkout -b feat/trazabilidad-assignee`.
- Al terminar: skill `/commit`, luego `gh pr create` con descripción completa (incluye la matriz en el cuerpo del PR).
- Después del PR: lanza el subagente `adversarial-reviewer` sobre él.
- Tu respuesta final en el chat es solo la URL del PR.

## PARTE 1 — con reloj (timebox: 25 min; anota la hora al empezar y al acabar)
Objetivo: matriz scenario → test, y escribir los tests que falten.

1. Lee el requisito y sus scenarios literalmente. No parafrasees los criterios.
2. Descubre cómo se expone hoy el `assignee`: rutas (`node ace list:routes`), controlador, transformer en `app/transformers/` y modelo. No asumas firmas: comprueba el código real. Averigua si "suelta" y "dentro de la lista" son dos endpoints distintos.
3. Busca tests existentes que toquen estos scenarios (`tests/functional/**`, incluido `auth/initials.spec.ts`, que cubre iniciales pero a nivel de auth, no de tarea). Un test cubre un scenario solo si ejercita su WHEN y afirma su THEN contra la API de tareas. Que mencione "assignee" o "iniciales" no basta.
4. Produce la matriz en `docs/traceability/assignee.md` con columnas:
   Scenario | Test que lo cubre (fichero + título) | Veredicto (CUBIERTO / PARCIAL / SIN TEST) | Qué falta
   Sé estricto: PARCIAL si solo cubre una de las vías (p. ej. tarea suelta pero no lista).
5. Para cada PARCIAL/SIN TEST escribe el test en `tests/functional/tasks/assignee.spec.ts` (Japa, estilo del resto de tests del repo, usando el `apiClient` tipado y los helpers de `tests/bootstrap.ts`).
   - Un test por scenario y por vía; el título del test cita el nombre del scenario.
   - Aserciones sobre lo que el spec exige: para el scenario 2, comprueba la AUSENCIA de `email` (y de cualquier otro dato de acceso) en el `assignee`, no solo la presencia de nombre e iniciales.
   - Aislamiento: la BD es compartida con el servidor de desarrollo. Usa los hooks de `testUtils.db()` (truncate o transacción global); no dejes estado entre runs.
6. Ejecuta `npm test` y `npm run typecheck` y `npm run lint`. Si un test nuevo falla, NO lo ajustes para que pase: es un hallazgo (bug de código o spec ambiguo). Márcalo en la matriz como "FALLA" y no cambies código de producción en esta parte.

Entregable de la parte 1: la matriz + los tests + salida real de los comandos. Si algo no lo pudiste verificar, dilo.

## PARTE 2 — sin reloj (reflexión, sobre lo que encontraste en la parte 1)
Escribe `docs/traceability/assignee-reflexion.md` con, como máximo, una página:
- Huecos reales vs. huecos de cobertura aparente: ¿qué tests parecían cubrir un scenario y no lo hacían, y por qué?
- Para cada test nuevo, ¿qué mutación del código lo haría fallar? (p. ej. añadir `email` al transformer, devolver `''` en vez de `null`). Verifica al menos una de verdad: aplícala temporalmente, comprueba que el test falla y revierte.
- Ambigüedades del spec (p. ej. "otro dato de acceso": ¿qué campos concretos? ¿qué pasa con iniciales de un nombre de una sola palabra?) y qué decisión tomaste y por qué.
- Qué NO cubre esta matriz (otros requisitos, frontend, concurrencia) y qué riesgo deja.
- Si algún test falló en la parte 1: diagnóstico y propuesta de arreglo (aplícalo solo si es trivial y está claro que el spec manda).

## Criterios de calidad
- Cada afirmación de la matriz es comprobable: ruta de fichero y título de test reales.
- No inventes rutas, campos ni helpers; si no existen, créalos mínimamente y dilo.
- No subas la cobertura con tests que no puedan fallar.
Dos notas:

prompts.md: el ejercicio pide pegar ahí cada prompt tal cual lo lanzaste. Pega este y el que me escribiste a mí, con el modelo y la herramienta.
Lo que no he mirado: no he leído el controlador ni el transformer de tareas. Por eso el prompt le manda al agente descubrirlos en vez de darlos por supuestos.


prompts.md
que significa - No subas la cobertura con tests que no puedan fallar.
6:35 PM
Significa que no escriban tests que pasen siempre, aunque el código esté roto. Esos tests hacen subir el número de cobertura (o rellenan la matriz con "CUBIERTO"), pero no protegen nada.

Un test puede fallar si existe algún cambio realista en el código que lo ponga en rojo. Uno que no puede fallar no comprueba nada útil.

Ejemplos con este requisito:

Test que no puede fallar: pedir una tarea y afirmar que la respuesta es 200. Pasa aunque assignee venga vacío, sin iniciales o con el email dentro.
Test que sí puede fallar: pedir una tarea y afirmar que assignee.email no existe, que assignee.name es "Ada Lovelace" y que las iniciales son "AL". Si alguien añade email al transformer, se pone en rojo.
Otro caso típico es el test que solo comprueba lo que el código ya devuelve por casualidad, por ejemplo assignee no es undefined. Pasa, pero no dice nada del scenario "no filtra datos de cuenta".

Por eso la Parte 2 del prompt pide la prueba de mutación: romper el código a propósito (añadir el email al transformer) y comprobar que el test falla. Si no falla, el test no vale, aunque la matriz diga "CUBIERTO".



dame un ejemplo facil y claro de lo que hace
6:36 PM
Imagina una alarma de casa que debería sonar si alguien abre la puerta.

Test que no puede fallar: compruebas que la alarma está enchufada. Siempre pasa, aunque esté rota, así que no dice nada sobre si suena.

Test que sí puede fallar: abres la puerta y compruebas que suena. Si la alarma se estropea, el test se pone en rojo.

En el código de FlowSync pasa lo mismo. El scenario dice: "la tarea no filtra el email del responsable".


// ❌ No puede fallar: pasa aunque el email se filtre
test('devuelve la tarea', async ({ client }) => {
  const response = await client.get('/api/v1/tasks/1')
  response.assertStatus(200)
})

// ✅ Puede fallar: se pone rojo si alguien añade el email
test('la tarea no filtra datos de cuenta', async ({ client, assert }) => {
  const response = await client.get('/api/v1/tasks/1')
  assert.notProperty(response.body().data.assignee, 'email')
})
Si mañana alguien añade email al transformer por error, el primer test sigue en verde y el segundo avisa. Por eso la matriz solo debe marcar "CUBIERTO" cuando el test es del segundo tipo.



dame un ejemplo paso a paso explicado de 
// ✅ Puede fallar: se pone rojo si alguien añade el email
test('la tarea no filtra datos de cuenta', async ({ client, assert }) => {
  const response = await client.get('/api/v1/tasks/1')
  assert.notProperty(response.body().data.assignee, 'email')
})
Show more
6:38 PM
Voy línea a línea, y luego te enseño cómo se pone rojo.

El test, paso a paso

test('la tarea no filtra datos de cuenta', async ({ client, assert }) => {
test(...) declara un test de Japa. El primer argumento es el título, que aquí repite el nombre del scenario.
client es el cliente HTTP de pruebas. Hace peticiones a tu API como si fuera el frontend.
assert son las funciones de comprobación.

  const response = await client.get('/api/v1/tasks/1')
Pide la tarea con id 1. En un test real, antes crearías esa tarea y su responsable en la BD. Aquí lo omito para que se vea la idea.

La respuesta del backend, por el serialize() del proyecto, tendría esta forma:


{
  "data": {
    "id": 1,
    "title": "Preparar demo",
    "assignee": { "name": "Ada Lovelace", "initials": "AL" }
  }
}

  assert.notProperty(response.body().data.assignee, 'email')
response.body() es ese JSON ya convertido en objeto.
.data.assignee baja hasta el objeto del responsable.
assert.notProperty(objeto, 'email') comprueba que el objeto no tiene la clave email. Si la tiene, el test falla.
Cómo se pone rojo
Código correcto. El transformer devuelve solo nombre e iniciales:


"assignee": { "name": "Ada Lovelace", "initials": "AL" }
email no está, así que el test pasa (verde).

Alguien rompe el transformer y añade email al pick(...):


"assignee": { "name": "Ada Lovelace", "initials": "AL", "email": "ada@x.com" }
Ahora email sí está, y el test falla (rojo) con un mensaje parecido a expected { ... } to not have property 'email'.

Un detalle importante
Este test solo comprueba que email no está. Si el transformer cambiara y añadiera password o token, seguiría en verde. El scenario dice "ningún otro dato de acceso", así que un test más estricto compararía las claves exactas:


assert.deepEqual(Object.keys(response.body().data.assignee).sort(), ['initials', 'name'])
Así cualquier campo extra lo pone en rojo. Esa es la diferencia entre un test que puede fallar y uno que falla ante todo lo que el scenario prohíbe.



que es Japa
6:39 PM
Japa es el framework de tests que usa AdonisJS. Es el equivalente a Jest o Vitest, pero hecho por el equipo de Adonis y pensado para backend.

Hace tres cosas en este proyecto:

Ejecuta los tests. npm test llama a node ace test, que busca los ficheros *.spec.ts y los corre.
Organiza los tests en suites. En adonisrc.ts hay dos: unit (tests/unit/, rápidos, timeout de 2 s) y functional (tests/functional/, con la API levantada, timeout de 30 s).
Da las herramientas para escribirlos. Los argumentos del test, como client y assert, vienen de sus plugins:
client es el apiClient, que hace peticiones HTTP a tu API sin abrir el navegador.
assert son las comprobaciones, como assert.notProperty o assert.equal.
Un test típico, como el de antes, tiene esta forma:


import { test } from '@japa/runner'

test('título del test', async ({ client, assert }) => {
  // hacer algo, comprobar el resultado
})
Puedes ejecutar solo una parte con los filtros que ya tienes en el CLAUDE.md:


node ace test functional                 # solo la suite functional
node ace test --files=assignee           # solo ficheros con ese nombre
node ace test --tests="no filtra datos"  # solo tests con ese título


Así cualquier campo extra lo pone en rojo. Esa es la diferencia entre un test que puede fallar y uno que falla ante todo lo que el scenario prohíbe. dame otro ememplo fácil de lo que debo testear
6:43 PM
Piensa en una tarjeta de visita que solo debe llevar nombre y cargo.

Test flojo: comprobar que no lleva teléfono. Si mañana alguien añade la dirección de casa, el test sigue en verde.

Test estricto: comprobar que lleva exactamente nombre y cargo, y nada más. Cualquier dato extra, sea teléfono, dirección o lo que sea, lo pone en rojo.

Con el scenario 3 de tu requisito (responsable sin nombre) sería así:


test('Responsable sin nombre', async ({ client, assert }) => {
  // preparación: crear una cuenta sin nombre y una tarea asignada a ella
  const response = await client.get('/api/v1/tasks/1')
  const assignee = response.body().data.assignee

  assert.isNull(assignee.name)                          // el nombre llega nulo
  assert.isNotEmpty(assignee.initials)                  // las iniciales siguen llegando
  assert.deepEqual(Object.keys(assignee).sort(), ['initials', 'name'])  // y nada más
})
Las tres líneas de assert comprueban cosas distintas:

isNull(assignee.name): el nombre es null, no "" ni undefined. El spec dice "nulo", así que un "" debe fallar.
isNotEmpty(assignee.initials): aunque no haya nombre, las iniciales existen. La interfaz las necesita para no tener que usar el email.
deepEqual(Object.keys(...)): las únicas claves son name e initials, así que cualquier campo extra lo pone en rojo.
Cada línea falla ante un fallo distinto: nombre vacío en vez de nulo, iniciales ausentes, o un dato extra filtrado. Por eso el test no puede pasar por casualidad.



la spec debe desarrollar entonces tests que fallen si no se cumple estricto?
6:48 PM
Casi, pero con dos matices.

1. La spec no desarrolla tests. La spec dice qué debe cumplir el sistema. Los tests los escribes tú (o el agente) a partir de ella. Cada scenario de la spec, con su WHEN y su THEN, te dice qué hay que provocar y qué hay que comprobar.

2. Estricto significa tan estricto como dice la spec, ni más ni menos.

Demasiado flojo: el test pasa aunque se rompa algo que la spec exige. Ejemplo: comprobar solo que no hay email, cuando la spec dice "ningún otro dato de acceso".
Demasiado estricto: el test falla por algo que la spec no exige. Ejemplo: afirmar que assignee tiene exactamente name e initials, cuando la spec solo dice que no haya email ni datos de acceso. Si mañana se añade un avatarUrl legítimo, el test fallaría sin que se haya incumplido nada.
Esto último afecta a lo que te enseñé antes. El deepEqual sobre las claves es válido solo si lo lees como la decisión que tomas ante una ambigüedad de la spec. La frase "lo justo para identificarlo" y "ningún otro dato" apunta a que solo viajen nombre e iniciales, pero no lo dice con esas palabras. Esa es justo la clase de cosa que la Parte 2 te pide anotar: "ambigüedades del spec y qué decisión tomé".

La regla práctica es que cada afirmación del test se pueda señalar con el dedo en una frase de la spec. Si no puedes, sobra o la spec es ambigua y debes dejarlo escrito.



el agente debo configurarlo para que desarrolle tests deepEqual o tal cual dice la spec y anotar las ambiguedades?
6:50 PM
Lo segundo: que el test siga lo que dice la spec y que anote las ambigüedades. No le pidas deepEqual por defecto.

Si le dices "usa deepEqual", el agente lo aplicará a todo y producirá tests demasiado estrictos. Si le dices "sigue la spec y anota las ambigüedades", elegirá en cada caso y dejará escrito por qué.

Añade al prompt, en la Parte 1, algo como:


## Criterio de aserciones
- Cada aserción debe poder justificarse con una frase literal del spec. Cítala en un comentario
  encima de la aserción.
- No afirmes más de lo que el spec exige, y no afirmes menos. No uses `deepEqual` sobre todo el
  objeto por defecto.
- Si el spec es ambiguo (p. ej. «ningún otro dato de acceso»: ¿qué campos?), NO decidas en
  silencio. Elige la lectura más cercana al texto, escribe el test con esa lectura y anota la
  ambigüedad en la matriz (columna «Ambigüedad») con la decisión tomada.
- Si una decisión cambia el resultado del test (p. ej. lista cerrada de claves vs. «sin email»),
  deja la alternativa descartada anotada.
La estrategia concreta para tu requisito es esta:

Con texto claro, afirma exactamente eso. Ejemplo: name es null (no ""), y las iniciales existen.
Con texto ambiguo, el agente elige una lectura y la anota. En "ningún otro dato de acceso" puede comprobar que no hay email, password ni token, o que las claves son solo name e initials. Cualquiera de las dos vale si queda anotada.
Esas anotaciones alimentan la Parte 2, la de reflexión, y son lo que luego puedes llevar al mentor en el directo.



esta parte la debo agrear al agente: ## PARTE 2 — sobre lo que encontraste en la parte 1
Escribe `docs/traceability/assignee-reflexion.md` con, como máximo, una página:
- Huecos reales vs. huecos de cobertura aparente: ¿qué tests parecían cubrir un scenario y no lo hacían, y por qué?
- Para cada test nuevo, ¿qué mutación del código lo haría fallar? (p. ej. añadir `email` al transformer, devolver `''` en vez de `null`). Verifica al menos una de verdad: aplícala temporalmente, comprueba que el test falla y revierte.
- Ambigüedades del spec (p. ej. "otro dato de acceso": ¿qué campos concretos? ¿qué pasa con iniciales de un nombre de una sola palabra?) y qué decisión tomaste y por qué.
- Qué NO cubre esta matriz (otros requisitos, frontend, concurrencia) y qué riesgo deja.
- Si algún test falló en la parte 1: diagnóstico y propuesta de arreglo (aplícalo solo si es trivial y está claro que el spec manda).

## Criterios de calidad
- Cada afirmación de la matriz es comprobable: ruta de fichero y título de test reales.
- No inventes rutas, campos ni helpers; si no existen, créalos mínimamente y dilo.
- No subas la cobertura con tests que no puedan fallar.
Show more
6:52 PM
Sí, puedes añadirla tal cual: es la misma Parte 2 y los mismos criterios de calidad que te di, con el título cambiado. Mejórala con tres cosas:

Pon el "sin reloj" en el título. Así el agente sabe que aquí no hay timebox y puede tomarse el tiempo para verificar las mutaciones.
Añade la columna «Ambigüedad» a la matriz de la Parte 1. Si no, la viñeta de ambigüedades de la Parte 2 no tiene de dónde sacar los datos. Pon el criterio de aserciones que te di antes dentro de la Parte 1.
Cambia la regla de las mutaciones. Hoy dice "verifica al menos una". Te recomiendo una por test nuevo, porque es lo que demuestra que el test puede fallar. Cuesta poco: aplicar, correr el test, revertir con git checkout.
Versión ajustada de la Parte 2:


## PARTE 2 — sin reloj: reflexión sobre lo que encontraste en la parte 1
Sin timebox. Escribe `docs/traceability/assignee-reflexion.md` (máximo una página) con:
- Huecos reales vs. huecos de cobertura aparente: ¿qué tests parecían cubrir un scenario y no lo
  hacían, y por qué?
- Para cada test nuevo, qué mutación del código lo haría fallar (p. ej. añadir `email` al
  transformer, devolver `''` en vez de `null`). Verifica UNA mutación por test: aplícala
  temporalmente, comprueba que el test falla, revierte con `git checkout -- <fichero>` y confirma
  con `git status` que no queda nada de la mutación.
- Ambigüedades del spec (columna «Ambigüedad» de la matriz): qué decisión tomaste, por qué, y qué
  alternativa descartaste.
- Qué NO cubre esta matriz (otros requisitos, frontend, concurrencia) y qué riesgo deja.
- Si algún test falló en la parte 1: diagnóstico y propuesta de arreglo (aplícalo solo si es
  trivial y está claro que el spec manda).

## Criterios de calidad
- Cada afirmación de la matriz es comprobable: ruta de fichero y título de test reales.
- No inventes rutas, campos ni helpers; si no existen, créalos mínimamente y dilo.
- No subas la cobertura con tests que no puedan fallar.
Un aviso: la regla de proceso del CLAUDE.md dice que el commit y el PR van al cerrar la tarea. Las mutaciones se revierten antes, así que el commit no debe arrastrar ningún cambio de producción. Si quieres curarte en salud, añade al prompt: "antes de /commit, git diff no debe mostrar cambios en app/, salvo un arreglo trivial aprobado".



verifica las instrucciones para el agente realice las partes a y b: Eres un ingeniero de QA/backend en FlowSync (monorepo; el backend es AdonisJS 7 + Lucid 22 + Japa, y todos los comandos se ejecutan desde `backend/`). Vas a construir una matriz de trazabilidad sobre UN requisito y a cerrar sus huecos de test.

## Alcance
Requisito: «Lo que cada tarea muestra de su responsable», en `openspec/specs/tasks/spec.md`.
Tiene 3 scenarios:
1. Responsable identificable (Ada Lovelace → `assignee` con nombre e iniciales).
2. La tarea no filtra datos de cuenta (`assignee` sin email ni datos de acceso; tarea suelta Y dentro de la lista).
3. Responsable sin nombre (nombre `null`, iniciales presentes).
No toques otros requisitos del spec.

## Reglas de proceso (CLAUDE.md)
- Antes de tocar nada: `git checkout -b feat/trazabilidad-assignee`.
- Al terminar: skill `/commit`, luego `gh pr create` con descripción completa (incluye la matriz en el cuerpo del PR).
- Después del PR: lanza el subagente `adversarial-reviewer` sobre él.
- Tu respuesta final en el chat es solo la URL del PR.

## PARTE 1
Objetivo: matriz scenario → test, y escribir los tests que falten.

1. Lee el requisito y sus scenarios literalmente. No parafrasees los criterios.
2. Descubre cómo se expone hoy el `assignee`: rutas (`node ace list:routes`), controlador, transformer en `app/transformers/` y modelo. No asumas firmas: comprueba el código real. Averigua si "suelta" y "dentro de la lista" son dos endpoints distintos.
3. Busca tests existentes que toquen estos scenarios (`tests/functional/**`, incluido `auth/initials.spec.ts`, que cubre iniciales pero a nivel de auth, no de tarea). Un test cubre un scenario solo si ejercita su WHEN y afirma su THEN contra la API de tareas. Que mencione "assignee" o "iniciales" no basta.
4. Produce la matriz en `docs/traceability/assignee.md` con columnas:
   Scenario | Test que lo cubre (fichero + título) | Veredicto (CUBIERTO / PARCIAL / SIN TEST) | Qué falta
   Sé estricto: PARCIAL si solo cubre una de las vías (p. ej. tarea suelta pero no lista).
5. Para cada PARCIAL/SIN TEST escribe el test en `tests/functional/tasks/assignee.spec.ts` (estilo del resto de tests del repo, usando el `apiClient` tipado y los helpers de `tests/bootstrap.ts`).
   - Un test por scenario y por vía; el título del test cita el nombre del scenario.
   - Aserciones sobre lo que el spec exige: para el scenario 2, comprueba la AUSENCIA de `email` (y de cualquier otro dato de acceso) en el `assignee`, no solo la presencia de nombre e iniciales.
   - Aislamiento: la BD es compartida con el servidor de desarrollo. Usa los hooks de `testUtils.db()` (truncate o transacción global); no dejes estado entre runs.
6. Ejecuta `npm test` y `npm run typecheck` y `npm run lint`. Si un test nuevo falla, NO lo ajustes para que pase: es un hallazgo (bug de código o spec ambiguo). Márcalo en la matriz como "FALLA" y no cambies código de producción en esta parte.

Si algo no lo pudiste verificar, dilo.

## PARTE 2 — sin reloj: reflexión sobre lo que encontraste en la parte 1
Sin timebox. Escribe `docs/traceability/assignee-reflexion.md` (máximo una página) con:
- Huecos reales vs. huecos de cobertura aparente: ¿qué tests parecían cubrir un scenario y no lo
  hacían, y por qué?
- Para cada test nuevo, qué mutación del código lo haría fallar (p. ej. añadir `email` al
  transformer, devolver `''` en vez de `null`). Verifica UNA mutación por test: aplícala
  temporalmente, comprueba que el test falla, revierte con `git checkout -- <fichero>` y confirma
  con `git status` que no queda nada de la mutación.
- Ambigüedades del spec (columna «Ambigüedad» de la matriz): qué decisión tomaste, por qué, y qué
  alternativa descartaste.
- Qué NO cubre esta matriz (otros requisitos, frontend, concurrencia) y qué riesgo deja.
- Si algún test falló en la parte 1: diagnóstico y propuesta de arreglo (aplícalo solo si es
  trivial y está claro que el spec manda).

## Criterios de calidad
- Cada afirmación de la matriz es comprobable: ruta de fichero y título de test reales.
- No inventes rutas, campos ni helpers; si no existen, créalos mínimamente y dilo.
- No subas la cobertura con tests que no puedan fallar.
Show less
6:54 PM
Está casi bien, pero hay cosas que hacen que el agente no cumpla lo que pediste. Las ordeno por importancia.

Fallos que corregir
Se perdió el reloj de la Parte 1. El encabezado dice solo "PARTE 1", y el enunciado pide la primera parte "con el reloj puesto". Sin el timebox, las dos partes son iguales.
Falta la columna «Ambigüedad» en la matriz (paso 4). La Parte 2 la cita ("columna «Ambigüedad» de la matriz"), pero la Parte 1 no la crea.
Falta el criterio de aserciones. Sin él, el agente no sabe cuándo usar deepEqual ni cuándo anotar una ambigüedad.
Contradicción sobre el código de producción. La Parte 1 dice "no cambies código de producción", y la Parte 2 manda mutar el transformer. Tienes que decir que las mutaciones son temporales y que se revierten.
Contradicción con la respuesta final. Dices "responde solo con la URL del PR" y también "si algo no lo pudiste verificar, dilo". Eso debe ir en el cuerpo del PR, no en el chat.
Riesgo de ensuciar el commit. git status muestra M backend/package.json, que no es tuyo. Sin una regla, /commit puede arrastrarlo. Además, git checkout -- <fichero> es seguro solo si el fichero estaba limpio antes de mutarlo.
No contempla que no exista un endpoint de tarea suelta. Si solo hay lista, el scenario 2 tiene una sola vía, y el agente debe decirlo en vez de inventar la ruta.
Cambios
En la Parte 1, cambia el encabezado y el paso 4:


## PARTE 1 — con reloj (timebox: 25 min; anota la hora de inicio y de fin en el PR)
...
4. Produce la matriz en `docs/traceability/assignee.md` con columnas:
   Scenario | Test que lo cubre (fichero + título) | Veredicto (CUBIERTO / PARCIAL / SIN TEST / FALLA) | Qué falta | Ambigüedad
Añade esto entre los pasos 5 y 6:


Criterio de aserciones:
- Cada aserción debe poder justificarse con una frase literal del spec; cítala en un comentario
  encima. No afirmes más ni menos de lo que el spec exige; no uses `deepEqual` sobre todo el
  objeto por defecto.
- Si el spec es ambiguo (p. ej. «ningún otro dato de acceso»), elige la lectura más cercana al
  texto, escribe el test con ella y anota en la columna «Ambigüedad» la decisión y la
  alternativa descartada.
- Si el spec habla de «tarea suelta» y no existe ese endpoint, no lo inventes: marca esa vía como
  «no existe» en la matriz.
Cambia la regla del paso 6:


6. ... Si un test nuevo falla, NO lo ajustes para que pase: es un hallazgo. Márcalo como FALLA.
   En esta parte no cambies código de producción.
En la Parte 2, añade al final de la viñeta de mutaciones:


  Las mutaciones son la única excepción a "no tocar producción", y siempre temporales. Antes de
  mutar, comprueba con `git status` que el fichero no tiene cambios previos. Antes del commit,
  `git diff -- app/` debe estar vacío (salvo un arreglo trivial aprobado).
Y sustituye las reglas de proceso por:


## Reglas de proceso (CLAUDE.md)
- Antes de tocar nada: `git checkout -b feat/trazabilidad-assignee`.
- `backend/package.json` ya aparece modificado y no es parte de esta tarea: no lo añadas al commit.
- Al terminar: skill `/commit`, luego `gh pr create`. El cuerpo del PR incluye la matriz, las
  horas de inicio y fin de la Parte 1, y todo lo que no pudiste verificar.
- Después del PR: lanza el subagente `adversarial-reviewer` sobre él.
- Tu respuesta final en el chat es solo la URL del PR.
Con esos cambios, el agente hace la Parte 1 con timebox, produce la matriz con ambigüedades, y en la Parte 2 verifica cada test con una mutación sin dejar restos en el commit.



spec.md
@openspec/changes/archive/2026-08-13-add-task-due-date/specs/tasks/
Read c:\Users\stlau\Documents\LIdr4Dev\flowsync-ai4devs-202609-1\openspec\changes\archive\2026-08-13-add-task-due-date\specs\tasks\spec.md
Grep "^### Requirement" (in c:\Users\stlau\Documents\LIdr4Dev\flowsync-ai4devs-202609-1\openspec\specs\tasks\spec.md)
32 lines of output
6:58 PM
Mandaste solo la ruta de esa carpeta, sin pregunta. La he leído porque afecta al prompt, y ya está fusionada en el spec principal (líneas 322–600). Cambia tres cosas que le dije al agente.

Lo que implica para el prompt
La tarea suelta sí existe, pero exige today. GET /api/v1/tasks/:id está en el requisito «Consulta de una tarea suelta». Según «El día de referencia lo pone quien mira», sin today=AAAA-MM-DD responde 422. El ejemplo client.get('/api/v1/tasks/1') que te enseñé fallaría por eso y no por el assignee. El agente debe pedir siempre /api/v1/tasks/:id?today=2026-08-13.
Ya hay dos vías para el assignee. Suelta (GET /tasks/:id, con sesión y today) y lista (GET /tasks, que no pide today). Eso confirma que el scenario 2 de tu requisito tiene dos vías. Mi nota de "si no existe el endpoint, no lo inventes" sigue valiendo, pero ahora el endpoint existe.
No te confundas de requisito. Muchos scenarios de ese cambio (vencimiento, today, 404, 401) no son de «Lo que cada tarea muestra de su responsable». Sirven solo como contexto de cómo se invoca la API. «No toques otros requisitos» sigue en pie.
Además, tu requisito dice «cualquier tarea, suelta o dentro de la lista», así que la tarea suelta cuenta. La interfaz también muestra el responsable en la pantalla de una tarea, pero eso es frontend y queda fuera de esta matriz. Anótalo en el apartado "qué NO cubre".

Parche para la Parte 1, paso 2

2. Descubre cómo se expone hoy el `assignee`: rutas (`node ace list:routes`), controlador,
   transformer y modelo. Hay dos vías: `GET /api/v1/tasks` (lista, no pide `today`) y
   `GET /api/v1/tasks/:id` (tarea suelta). Ojo: la tarea suelta exige sesión y el parámetro
   `today=AAAA-MM-DD` (formato AAAA-MM-DD); sin él responde 422 y el test no estaría probando el
   `assignee`. Usa siempre `?today=2026-08-13` (o similar) en esa vía y verifica en el código
   que es así. Todo lo de vencimiento (fecha, `overdue`) queda fuera de tu requisito: no lo
   afirmes ni lo testees aquí.
Con esto, el agente no escribirá un test que falle por un 422 ni uno que pase sin probar nada.



verifica las instrucciones para el agente realice las partes a y b: Eres un ingeniero de QA/backend en FlowSync (monorepo; el backend es AdonisJS 7 + Lucid 22 + Japa, y todos los comandos se ejecutan desde `backend/`). Vas a construir una matriz de trazabilidad sobre UN requisito y a cerrar sus huecos de test.

## Alcance
Requisito: «Lo que cada tarea muestra de su responsable», en `openspec/specs/tasks/spec.md`.
Tiene 3 scenarios:
1. Responsable identificable (Ada Lovelace → `assignee` con nombre e iniciales).
2. La tarea no filtra datos de cuenta (`assignee` sin email ni datos de acceso; tarea suelta Y dentro de la lista).
3. Responsable sin nombre (nombre `null`, iniciales presentes).
No toques otros requisitos del spec.

## Reglas de proceso (CLAUDE.md)
- Antes de tocar nada: `git checkout -b feat/trazabilidad-assignee`.
- Al terminar: skill `/commit`, luego `gh pr create` con descripción completa (incluye la matriz en el cuerpo del PR).
- Después del PR: lanza el subagente `adversarial-reviewer` sobre él.
- Tu respuesta final en el chat es solo la URL del PR.

## PARTE 1
Objetivo: matriz scenario → test, y escribir los tests que falten.

1. Lee el requisito y sus scenarios literalmente. No parafrasees los criterios.
2. Descubre cómo se expone hoy el `assignee`: rutas (`node ace list:routes`), controlador, transformer en `app/transformers/` y modelo. No asumas firmas: comprueba el código real. Averigua si "suelta" y "dentro de la lista" son dos endpoints distintos.
3. Busca tests existentes que toquen estos scenarios (`tests/functional/**`, incluido `auth/initials.spec.ts`, que cubre iniciales pero a nivel de auth, no de tarea). Un test cubre un scenario solo si ejercita su WHEN y afirma su THEN contra la API de tareas. Que mencione "assignee" o "iniciales" no basta.
4. Produce la matriz en `docs/traceability/assignee.md` con columnas:
   Scenario | Test que lo cubre (fichero + título) | Veredicto (CUBIERTO / PARCIAL / SIN TEST) | Qué falta
   Sé estricto: PARCIAL si solo cubre una de las vías (p. ej. tarea suelta pero no lista).
5. Para cada PARCIAL/SIN TEST escribe el test en `tests/functional/tasks/assignee.spec.ts` (estilo del resto de tests del repo, usando el `apiClient` tipado y los helpers de `tests/bootstrap.ts`).
   - Un test por scenario y por vía; el título del test cita el nombre del scenario.
   - Aserciones sobre lo que el spec exige: para el scenario 2, comprueba la AUSENCIA de `email` (y de cualquier otro dato de acceso) en el `assignee`, no solo la presencia de nombre e iniciales.
   - Aislamiento: la BD es compartida con el servidor de desarrollo. Usa los hooks de `testUtils.db()` (truncate o transacción global); no dejes estado entre runs.
6. Ejecuta `npm test` y `npm run typecheck` y `npm run lint`. Si un test nuevo falla, NO lo ajustes para que pase: es un hallazgo (bug de código o spec ambiguo). Márcalo en la matriz como "FALLA" y no cambies código de producción en esta parte.

Si algo no lo pudiste verificar, dilo.

## PARTE 2 — sin reloj: reflexión sobre lo que encontraste en la parte 1
Sin timebox. Escribe `docs/traceability/assignee-reflexion.md` (máximo una página) con:
- Huecos reales vs. huecos de cobertura aparente: ¿qué tests parecían cubrir un scenario y no lo
  hacían, y por qué?
- Para cada test nuevo, qué mutación del código lo haría fallar (p. ej. añadir `email` al
  transformer, devolver `''` en vez de `null`). Verifica UNA mutación por test: aplícala
  temporalmente, comprueba que el test falla, revierte con `git checkout -- <fichero>` y confirma
  con `git status` que no queda nada de la mutación.
- Ambigüedades del spec (columna «Ambigüedad» de la matriz): qué decisión tomaste, por qué, y qué
  alternativa descartaste.
- Qué NO cubre esta matriz (otros requisitos, frontend, concurrencia) y qué riesgo deja.
- Si algún test falló en la parte 1: diagnóstico y propuesta de arreglo (aplícalo solo si es
  trivial y está claro que el spec manda).

## Criterios de calidad
- Cada afirmación de la matriz es comprobable: ruta de fichero y título de test reales.
- No inventes rutas, campos ni helpers; si no existen, créalos mínimamente y dilo.
- No subas la cobertura con tests que no puedan fallar.
Show more
6:59 PM
Este es el prompt original: no incluye ninguna de las correcciones anteriores. Sigue sin timebox, sin columna «Ambigüedad», sin criterio de aserciones, con las contradicciones sobre producción y respuesta final, y sin el aviso de today. Con él, el agente haría un trabajo peor.

Te dejo la versión completa con todo integrado, lista para pegar:


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
- Al terminar: skill `/commit`, luego `gh pr create`. El cuerpo del PR incluye la matriz, las horas de inicio y fin de la Parte 1, y todo lo que no pudiste verificar.
- Después del PR: lanza el subagente `adversarial-reviewer` sobre él.
- Tu respuesta final en el chat es solo la URL del PR.

## PARTE 1 — con reloj (timebox: 25 min; anota hora de inicio y de fin)
Objetivo: matriz scenario → test, y escribir los tests que falten.

1. Lee el requisito y sus scenarios literalmente. No parafrasees los criterios.
2. Descubre cómo se expone hoy el `assignee`: rutas (`node ace list:routes`), controlador, transformer en `app/transformers/` y modelo. No asumas firmas: comprueba el código real. Hay dos vías: `GET /api/v1/tasks` (lista, no pide `today`) y `GET /api/v1/tasks/:id` (tarea suelta). La tarea suelta exige sesión y `today=AAAA-MM-DD`; sin él responde 422 y el test no probaría el `assignee`. Usa `?today=2026-08-13` en esa vía y verifica en el código que es así.
3. Busca tests existentes que toquen estos scenarios (`tests/functional/**`, incluido `auth/initials.spec.ts`, que cubre iniciales a nivel de auth, no de tarea). Un test cubre un scenario solo si ejercita su WHEN y afirma su THEN contra la API de tareas. Que mencione "assignee" o "iniciales" no basta.
4. Produce la matriz en `docs/traceability/assignee.md` con columnas:
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

## PARTE 2 — sin reloj: reflexión sobre lo que encontraste en la parte 1
Sin timebox. Escribe `docs/traceability/assignee-reflexion.md` (máximo una página) con:
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
Una cosa que no pude comprobar: no he leído el controlador ni el transformer de tareas, así que lo de today en la tarea suelta viene del spec, no del código. El paso 2 hace que el agente lo verifique.



la parte del reloj es para mi, no para el agente quitala
7:01 PM
Quito el reloj de las dos partes y de las reglas del PR. Con esto, las horas de inicio y fin las llevas tú. Aquí tienes la versión completa:


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
- Al terminar: skill `/commit`, luego `gh pr create`. El cuerpo del PR incluye la matriz y todo lo que no pudiste verificar.
- Después del PR: lanza el subagente `adversarial-reviewer` sobre él.
- Tu respuesta final en el chat es solo la URL del PR.

## PARTE 1 — matriz y tests
Objetivo: matriz scenario → test, y escribir los tests que falten.

1. Lee el requisito y sus scenarios literalmente. No parafrasees los criterios.
2. Descubre cómo se expone hoy el `assignee`: rutas (`node ace list:routes`), controlador, transformer en `app/transformers/` y modelo. No asumas firmas: comprueba el código real. Hay dos vías: `GET /api/v1/tasks` (lista, no pide `today`) y `GET /api/v1/tasks/:id` (tarea suelta). La tarea suelta exige sesión y `today=AAAA-MM-DD`; sin él responde 422 y el test no probaría el `assignee`. Usa `?today=2026-08-13` en esa vía y verifica en el código que es así.
3. Busca tests existentes que toquen estos scenarios (`tests/functional/**`, incluido `auth/initials.spec.ts`, que cubre iniciales a nivel de auth, no de tarea). Un test cubre un scenario solo si ejercita su WHEN y afirma su THEN contra la API de tareas. Que mencione "assignee" o "iniciales" no basta.
4. Produce la matriz en `docs/traceability/assignee.md` con columnas:
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
Escribe `docs/traceability/assignee-reflexion.md` (máximo una página) con:
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
Para tus dos partes, lanza el prompt y cronometra tú los 25 minutos de la Parte 1. La Parte 2 la haces después, sin límite, leyendo la reflexión del agente.

Eres un ingeniero de QA/backend en FlowSync (monorepo; el backend es AdonisJS 7 + Lucid 22 + Japa, y todos los comandos se ejecutan desde `backend/`). Vas a construir una matriz de trazabilidad sobre UN requisito y a cerrar sus huecos de test.

## Alcance
Requisito: «Lo que cada tarea muestra de su responsable», en `openspec/specs/tasks/spec.md`.
Tiene 3 scenarios:
1. Responsable identificable (Ada Lovelace → `assignee` con nombre e iniciales).
2. La tarea no filtra datos de cuenta (`assignee` sin email ni datos de acceso; tarea suelta Y dentro de la lista).
3. Responsable sin nombre (nombre `null`, iniciales presentes).
No toques otros requisitos del spec.

## Reglas de proceso (CLAUDE.md)
- Antes de tocar nada: `git checkout -b feat/trazabilidad-assignee`.
- Al terminar: skill `/commit`, luego `gh pr create` con descripción completa (incluye la matriz en el cuerpo del PR).
- Después del PR: lanza el subagente `adversarial-reviewer` sobre él.
- Tu respuesta final en el chat es solo la URL del PR.

## PARTE 1
Objetivo: matriz scenario → test, y escribir los tests que falten.

1. Lee el requisito y sus scenarios literalmente. No parafrasees los criterios.
2. Descubre cómo se expone hoy el `assignee`: rutas (`node ace list:routes`), controlador, transformer en `app/transformers/` y modelo. No asumas firmas: comprueba el código real. Averigua si "suelta" y "dentro de la lista" son dos endpoints distintos.
3. Busca tests existentes que toquen estos scenarios (`tests/functional/**`, incluido `auth/initials.spec.ts`, que cubre iniciales pero a nivel de auth, no de tarea). Un test cubre un scenario solo si ejercita su WHEN y afirma su THEN contra la API de tareas. Que mencione "assignee" o "iniciales" no basta.
4. Produce la matriz en `docs/traceability/assignee.md` con columnas:
   Scenario | Test que lo cubre (fichero + título) | Veredicto (CUBIERTO / PARCIAL / SIN TEST) | Qué falta
   Sé estricto: PARCIAL si solo cubre una de las vías (p. ej. tarea suelta pero no lista).
5. Para cada PARCIAL/SIN TEST escribe el test en `tests/functional/tasks/assignee.spec.ts` (estilo del resto de tests del repo, usando el `apiClient` tipado y los helpers de `tests/bootstrap.ts`).
   - Un test por scenario y por vía; el título del test cita el nombre del scenario.
   - Aserciones sobre lo que el spec exige: para el scenario 2, comprueba la AUSENCIA de `email` (y de cualquier otro dato de acceso) en el `assignee`, no solo la presencia de nombre e iniciales.
   - Aislamiento: la BD es compartida con el servidor de desarrollo. Usa los hooks de `testUtils.db()` (truncate o transacción global); no dejes estado entre runs.
6. Ejecuta `npm test` y `npm run typecheck` y `npm run lint`. Si un test nuevo falla, NO lo ajustes para que pase: es un hallazgo (bug de código o spec ambiguo). Márcalo en la matriz como "FALLA" y no cambies código de producción en esta parte.

Si algo no lo pudiste verificar, dilo.

## PARTE 2 — sin reloj: reflexión sobre lo que encontraste en la parte 1
Sin timebox. Escribe `docs/traceability/assignee-reflexion.md` (máximo una página) con:
- Huecos reales vs. huecos de cobertura aparente: ¿qué tests parecían cubrir un scenario y no lo
  hacían, y por qué?
- Para cada test nuevo, qué mutación del código lo haría fallar (p. ej. añadir `email` al
  transformer, devolver `''` en vez de `null`). Verifica UNA mutación por test: aplícala
  temporalmente, comprueba que el test falla, revierte con `git checkout -- <fichero>` y confirma
  con `git status` que no queda nada de la mutación.
- Ambigüedades del spec (columna «Ambigüedad» de la matriz): qué decisión tomaste, por qué, y qué
  alternativa descartaste.
- Qué NO cubre esta matriz (otros requisitos, frontend, concurrencia) y qué riesgo deja.
- Si algún test falló en la parte 1: diagnóstico y propuesta de arreglo (aplícalo solo si es
  trivial y está claro que el spec manda).

## Criterios de calidad
- Cada afirmación de la matriz es comprobable: ruta de fichero y título de test reales.
- No inventes rutas, campos ni helpers; si no existen, créalos mínimamente y dilo.
- No subas la cobertura con tests que no puedan fallar.




nombre con el que guardo el agente en /agents?
7:03 PM
Te propongo traceability-tester. Va en minúsculas con guiones, igual que el adversarial-reviewer que ya tienes, y describe lo que hace. Se guarda en .claude/agents/traceability-tester.md.

Cabecera mínima del fichero, con el prompt debajo:


---
name: traceability-tester
description: Construye una matriz de trazabilidad scenario → test para un requisito de openspec y escribe los tests que faltan. Usar cuando se pida auditar la cobertura de un requisito del spec.
tools: Read, Grep, Glob, Bash, Write, Edit
---

Eres un ingeniero de QA/backend en FlowSync...
Dos avisos:

tools: el agente necesita Write y Edit para crear tests y documentos. El adversarial-reviewer solo tiene Read, Grep, Glob, Bash, porque es de solo lectura.
El paso del adversarial-reviewer no funcionará dentro del agente. Los subagentes no pueden lanzar a otros subagentes, así que "lanza el subagente adversarial-reviewer" fallará. Quita ese paso del prompt y que el agente termine con la URL del PR. Después, tú (o la sesión principal) lanzas el adversarial-reviewer sobre el PR.
Como el prompt está atado a este requisito, también puedes guardarlo como prompt suelto y pegarlo en una sesión normal. Si lo dejas como agente, cambia el "Alcance" para que el requisito llegue por parámetro y sirva para otros.



debo correr el traceability-agent primero y luego el adversarial-review?
7:04 PM
Sí, en ese orden: primero el que construye (traceability-tester) y después el que intenta refutar (adversarial-reviewer).

Primero va el tester porque el reviewer revisa un PR, y el PR no existe hasta que el tester termina: crea la rama, escribe los tests, hace el commit y abre el PR. El reviewer necesita ese PR para buscar tests que no pueden fallar, aserciones que no sacan de la spec o ambigüedades anotadas a medias.

El flujo:

Lanzas traceability-tester. Tú cronometras los 25 minutos de la Parte 1. Al acabar te devuelve la URL del PR.
Lanzas adversarial-reviewer sobre ese PR, desde la sesión principal. Es el paso que quitamos del prompt del agente.
Lees sus hallazgos. Los que valgan (un test que no puede fallar, una aserción sin frase de la spec que la respalde) los corriges tú o se los devuelves al tester.
El nombre del agente que tienes es adversarial-reviewer. Si le dices al lanzarlo algo como "revisa el PR <url>, especialmente si cada test puede fallar de verdad y si cada aserción sale de una frase del spec", su revisión será más útil que con un "revisa este PR" suelto.


el PR lo hago yo, y el archivo con la matrix debe ir en  docs/verificacion/,esta contemplado en el prompt?

debo correr el traceability-agent primero y luego el adversarial-review?

//*****************Resultado de correr el agente*****************//

el resumen del PR que se ve en las capturas hay tres cosas que debes saber:

Los tests no se ejecutaron. El texto dice que una política de Windows bloquea @swc/core y que better-sqlite3 no es válido para Win32. Solo pasaron typecheck y lint. Sin ejecutarlos no sabes si pasan, y el prompt exigía correr npm test. Prueba tú npm install en backend/ y luego npm test, o pregúntale a esa sesión qué pasó exactamente.
Hay un hallazgo real, pero deducido leyendo código. La lista falla en el scenario 2: TaskTransformer reutiliza UserTransformer y expone email, createdAt y updatedAt. Es justo el tipo de fallo que busca el ejercicio, pero hasta que el test corra y salga en rojo es una hipótesis. Está bien que no lo arreglara.
La reflexión usa mutaciones "solo por análisis". El prompt pedía aplicarlas de verdad. Es consecuencia del punto 1: sin entorno de tests no se pudieron comprobar.
También anota que el agente lanzó adversarial-reviewer ("Revisión adversarial del PR") desde la sesión principal, que es lo que CLAUDE.md pide tras abrir el PR. Si ya terminó, su resultado te sirve. Si no quieres esa revisión todavía, puedes ignorarla.
Show less
7:56 PM
Haz estos pasos en PowerShell, desde la raíz del repo. Antes de nada, la rama feat/trazabilidad-assignee no está en el remoto, así que primero hay que subirla.



------------
❯ Usa el agente traceability-tester sobre el requisito «Lo que cada tarea muestra de su responsable» de openspec/specs/tasks/spec.md

● traceability-tester(Trazabilidad requisito responsable)
Backgrounded agent (↓ to manage · ctrl+o to expand)

Lancé de nuevo el agente traceability-tester sobre el requisito. Le pedí que parta del trabajo ya existente en la rama (commit 198868d) en vez de duplicarlo. También le dije que intente ejecutar los tests y que no reinstale ni recompile better-sqlite3.

Sigue en ejecución. Te paso el resultado cuando termine.

✻ Waiting for 1 background agent to finish

● Agent "Trazabilidad requisito responsable" finished · 5m 28s

El agente terminó, pero los tests siguen sin ejecutarse. Los 6 fallan en el setup con better_sqlite3.node is not a valid Win32 application. No recompiló ni reinstaló better-sqlite3.

Matriz

Cada scenario tiene un test por vía (tarictos salen de leer el código.

┌────────────────────────────────────┬───────────────────────────────────┐
│              Scenario              │                           Veredicto                            │
├────────────────────────────────────┼───────────────────────────────────┤
│ Responsable identificable          │ Cubierto en ambas vías (test escrito, sin ejecutar)            │
├────────────────────────────────────┼───────────────────────────────────┤
│ La tarea no filtra datos de cuenta │ Tarea suelta cubierta. La lista falla (por lectura del código) │
├────────────────────────────────────┼───────────────────────────────────┤
│ Responsable sin nombre             │ Cubierto en ambas vías (test escrito, sin ejecutar)            │
└────────────────────────────────────┴───────────────────────────────────┘

Hallazgo

La lista y POST /tasks serializan el asse incluye email, createdAt y updatedAt. El agente lo confirmó con el tipo generado del cliente en .adonisjs/client/registry y con los controladores.

- Arreglo propuesto, no aplicado: usar TaskAssigneeTransformer en TaskTransformer. git diff -- app/ está vacío.
- Sin test: POST /tasks y el cambio de el, y el scenario dice «cualquier tarea».

Cambios sobre el commit anterior

- Los helpers pasaron de client: any a A
- El helper de la lista lanza un error claro si la tarea no aparece.
- Los documentos ahora dicen que «CUBIER no «verificado».

Los cambios se commitearon en feat/traza/package.json ni prompts.md. No se abrióPR.

Falta ejecutar los 6 tests y aplicar las mutaciones. Para ejecutarlos hace falta otra máquina, o resolver better-sqlite3 en esta.


Resuelve sqllite3 y continua

Dime si quieres que haga alguna de estas cosas:
1. Aplicar el arreglo, que es usar TaskAssigneeTransformer en TaskTransformer, y comprobar que los 6 tests pasan.
2. Actualizar los documentos con los resultados reales.
3. Cubrir POST /tasks y el cambio de estado, que también filtran el email.

✻ Brewed for 21s · done 8:15 PM

❯ OK CONTINUA CON ESOS PUNTOS 1 , 2 Y 3