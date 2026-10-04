# Tickets de FS-142: Filtrar las tareas por estado

Descomposición de la historia [FS-142](./us-filtrar-por-estado.md). Cada ticket hereda los criterios de la historia, que se citan por su número (CA-n). La Definition of Done es solo «cómo lo entregamos», sin criterios nuevos ni estimaciones.

**No hay ticket de Migración/DB.** El filtro trabaja con el estado que la tarea ya tiene, y CA-16 propone no guardar nada por persona. No hay tickets de tipo Bug.

## Dependencias externas de FS-142

- **Que la tarea exista.** Crear, listar, cambiar de estado y archivar tareas. Son otras historias de E2, sin identificador asignado todavía.
- **La frescura de E3** (ver los cambios de otros sin recargar), sin identificador asignado. La necesita CA-18.
- **Ejecutor de pruebas del frontend.** Hoy no hay ninguno. Es el trabajo habilitador del PRD, sin identificador asignado.
- **FS-118.** CA-9 habla de conservar «la marca de vencida». Si FS-118 no está hecha, no hay marca que conservar.
- **Decisiones abiertas:** CA-11, CA-15 y CA-16.

## Tickets

### FS-142.1: Regla de filtrado por estado
- **Tipo:** Modelo/Dominio
- **Capa:** lógica de dominio.
- **Hereda:** CA-1, CA-2, CA-3, CA-4, CA-5, CA-6, CA-7, CA-9 y CA-13.
- **Definition of Done:**
  - [ ] Cada criterio heredado tiene al menos una prueba unitaria con su DADO/CUANDO/ENTONCES.
  - [ ] Se prueba que filtrar por cada uno de los tres estados deja fuera a los demás, y que sin filtro salen todas las activas.
  - [ ] Se prueba que una tarea archivada no sale con ningún filtro ni sin filtro (CA-7).
  - [ ] Se prueba que filtrar no modifica ninguna tarea (CA-9).
  - [ ] La regla vive en el modelo y no en controladores.
  - [ ] Usa los alias de importación del proyecto.
  - [ ] Lint y comprobación de tipos pasan.
- **Depende de:** la tarea existe (externo). CA-7 necesita además que exista el archivado (externo).

### FS-142.2: Reconocer un estado que no existe
- **Tipo:** Modelo/Dominio
- **Capa:** lógica de dominio y validación.
- **Hereda:** CA-6, CA-10 y CA-13.
- **Definition of Done:**
  - [ ] Un estado que no es ninguno de los tres se detecta como error, con un mensaje en castellano que lista los estados válidos.
  - [ ] Hay una prueba que comprueba que ese caso **no** acaba en una lista vacía silenciosa.
  - [ ] Un filtro en blanco se trata como «sin filtro» y no como error (CA-13).
  - [ ] Los validadores siguen el estilo de los existentes.
  - [ ] Lint y comprobación de tipos pasan.
- **Depende de:** FS-142.1.

### FS-142.3: Listar las tareas activas con filtro opcional por estado
- **Tipo:** Endpoint/API
- **Capa:** endpoint, ampliando el de listar tareas.
- **Hereda:** CA-1, CA-2, CA-3, CA-4, CA-5, CA-7, CA-8, CA-9, CA-10, CA-12, CA-13 y CA-17.
- **Definition of Done:**
  - [ ] Una prueba funcional por cada criterio heredado.
  - [ ] Un estado inexistente devuelve un error en castellano y por campo, y una prueba demuestra que no devuelve una lista vacía (CA-10).
  - [ ] Un estado válido sin tareas se distingue del error (CA-12).
  - [ ] Dos miembros con el mismo filtro reciben el mismo resultado (CA-8).
  - [ ] Sin sesión iniciada no se devuelve ninguna tarea (CA-17).
  - [ ] La respuesta pasa por el transformer, con el envoltorio común.
  - [ ] Las pruebas aíslan la base de datos para no ensuciar la de desarrollo.
  - [ ] Los tipos generados del cliente se regeneran y se commitean.
  - [ ] Lint y comprobación de tipos pasan.
- **Depende de:** FS-142.1, FS-142.2 y el endpoint de listar (externo).

### FS-142.4: Selector de filtro por estado en la lista
- **Tipo:** Frontend
- **Capa:** interfaz de usuario.
- **Hereda:** CA-1, CA-2, CA-3, CA-4, CA-5, CA-6, CA-9 y CA-17.
- **Definition of Done:**
  - [ ] Las opciones son exactamente los tres estados, más quitar el filtro, y ninguno viene preseleccionado (CA-5 y CA-6).
  - [ ] Quitar el filtro devuelve todas las activas (CA-4).
  - [ ] Filtrar no cambia ninguna tarea ni su información visible (CA-9).
  - [ ] Sin sesión se sigue llevando a iniciar sesión (CA-17).
  - [ ] Toda llamada a la API pasa por el módulo único de acceso a la API.
  - [ ] Usa componentes de la librería de interfaz ya instalados, sin editarlos a mano.
  - [ ] La compilación con comprobación de tipos, el lint y el formateo pasan.
  - [ ] Pruebas automáticas si ya hay ejecutor. Si no, comprobación manual de cada criterio anotada en el ticket.
- **Depende de:** FS-142.3 y la lista en la interfaz (externo).

### FS-142.5: Mensajes de lista vacía y de estado inexistente
- **Tipo:** Frontend
- **Capa:** interfaz de usuario.
- **Hereda:** CA-10, CA-11 y CA-12.
- **Definition of Done:**
  - [ ] El aviso de estado inexistente sale en castellano, nombra los estados válidos y se ve claramente distinto del mensaje de lista vacía (CA-10 y CA-12).
  - [ ] Nunca se muestra «no hay tareas» ante un estado que no existe.
  - [ ] Lo que se ve junto al aviso sigue lo que se decida en CA-11, y la lista no se presenta como filtrada.
  - [ ] Los errores llegan con el mensaje ya traducido por el módulo de acceso a la API.
  - [ ] La compilación con comprobación de tipos, el lint y el formateo pasan.
  - [ ] Pruebas automáticas si ya hay ejecutor. Si no, comprobación manual anotada en el ticket.
- **Depende de:** FS-142.4. **Bloqueado por la decisión de CA-11.**

### FS-142.6: Comportamiento del filtro al cambiar o crear tareas y al volver
- **Tipo:** Frontend
- **Capa:** interfaz de usuario.
- **Hereda:** CA-14, CA-15 y CA-16.
- **Definition of Done:**
  - [ ] Cambiar el estado de una tarea con filtro activo la saca de la vista y deja el filtro puesto (CA-14).
  - [ ] Crear una tarea que no coincide con el filtro actúa como decida CA-15, con prueba o comprobación para el caso con aviso y para el caso sin él.
  - [ ] Al volver a abrir la lista, el filtro se comporta como decida CA-16 y, si se decide no recordarlo, no se guarda nada por persona.
  - [ ] La compilación con comprobación de tipos, el lint y el formateo pasan.
  - [ ] Pruebas automáticas si ya hay ejecutor. Si no, comprobación manual de cada criterio anotada en el ticket.
- **Depende de:** FS-142.4 y las acciones de crear y cambiar estado en la interfaz (externo). **Bloqueado por las decisiones de CA-15 y CA-16.**

### FS-142.7: Aplicar el filtro a los cambios que llegan de otros
- **Tipo:** Frontend
- **Capa:** interfaz de usuario.
- **Hereda:** CA-18.
- **Definition of Done:**
  - [ ] Cuando llega un cambio de otro miembro, la tarea aparece o desaparece según cumpla el filtro activo.
  - [ ] El plazo en que se ve lo fija E3, y este ticket no lo redefine.
  - [ ] El filtro sigue activo tras el cambio entrante.
  - [ ] La compilación con comprobación de tipos, el lint y el formateo pasan.
  - [ ] Pruebas automáticas si ya hay ejecutor. Si no, comprobación manual anotada en el ticket.
- **Depende de:** FS-142.4 y la frescura de E3 (externo).

### FS-142.8: Pruebas de aceptación de los escenarios que cruzan capas
- **Tipo:** Test
- **Capa:** pruebas de extremo a extremo.
- **Hereda:** CA-7, CA-8, CA-10 y CA-14, los que mezclan filtro con archivado, con varios miembros o con cambios de estado.
- **Definition of Done:**
  - [ ] Cada escenario está escrito con su DADO/CUANDO/ENTONCES.
  - [ ] Se cubre el estado inexistente de punta a punta, comprobando que nunca llega una lista vacía en silencio.
  - [ ] Son independientes del orden y aíslan la base de datos.
  - [ ] Pasan en local con el comando de pruebas del proyecto.
- **Depende de:** FS-142.3, FS-142.4 y FS-142.5.

## Orden de entrega

```
FS-142.1 ── FS-142.2 ── FS-142.3 ── FS-142.4 ─┬─ FS-142.5 ─┐
                                              ├─ FS-142.6  ├─ FS-142.8
                                              └─ FS-142.7  │
                                                           ┘
```

## Cosas a vigilar

- **FS-118.7 depende de FS-142.3.** Ambos amplían el mismo endpoint de listar. Conviene decidir quién va primero, para no pisarse. FS-118.7 ya declara FS-142 como dependencia, y ahora el ticket concreto es FS-142.3.
- **Decisiones que bloquean:** FS-142.5 espera a CA-11, y FS-142.6 a CA-15 y CA-16. Hasta que se resuelvan, pueden prepararse pero no cerrarse.
- **El camino mínimo,** si hay que recortar, es FS-142.1, 142.2, 142.3 y 142.4. Con eso ya se filtra por estado y se avisa del estado inexistente. Los demás tickets refinan la experiencia.
