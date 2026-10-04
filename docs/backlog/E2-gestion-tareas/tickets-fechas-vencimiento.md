# Tickets de FS-118: Fecha de vencimiento y tareas vencidas

Descomposición de la historia [FS-118](./us-fechas-vencimiento.md). Cada ticket hereda los criterios de la historia, que se citan por su número (CA-n). La Definition of Done es solo «cómo lo entregamos», sin criterios nuevos ni estimaciones. No hay tickets de tipo Bug: no hay nada roto que arreglar.

## Dependencias externas de FS-118

Estas piezas no son tickets de esta historia, y varias bloquean. Dos de ellas no tienen identificador asignado todavía.

- **Que la tarea exista.** Crear, listar, editar, cambiar de estado y archivar tareas, y la vista de archivadas. Son otras historias de E2, sin identificador asignado. Sin ellas, FS-118 no tiene dónde colgarse.
- **FS-142.** El filtro por estado. Lo necesita CA-19.
- **Ejecutor de pruebas del frontend.** Hoy no hay ninguno. Es el trabajo habilitador del PRD, sin identificador asignado.
- **Decisiones abiertas** de la historia: CA-14, CA-16 y CA-17.

## Tickets

### FS-118.1: Almacenar la fecha de vencimiento de la tarea
- **Tipo:** Migración/DB
- **Capa:** migración de base de datos.
- **Hereda:** CA-1, CA-2, CA-4, CA-5, CA-6, que exigen poder guardar una fecha, cambiarla y quitarla, siendo opcional.
- **Definition of Done:**
  - [ ] La migración se aplica y se deshace sin error sobre una base limpia.
  - [ ] Las tareas que ya existían siguen intactas.
  - [ ] El esquema generado se regenera con la migración y se commitea, sin editarlo a mano.
  - [ ] Sigue la convención de nombres de las migraciones existentes.
- **Depende de:** la tarea existe (externo). Si esa historia aún no ha creado la tabla, conviene coordinar para no hacer dos migraciones donde basta una.

### FS-118.2: Definir qué es «hoy» para el equipo
- **Tipo:** Modelo/Dominio
- **Capa:** lógica de dominio.
- **Hereda:** CA-11 y CA-16.
- **Definition of Done:**
  - [ ] «Hoy» se calcula en un solo sitio, que el resto de las reglas reutiliza.
  - [ ] Pruebas unitarias para CA-11 (el mismo día no es vencida, el siguiente sí) y para CA-16 (dos personas, mismo resultado).
  - [ ] Las pruebas controlan la hora y no dependen del reloj real.
  - [ ] Lint y comprobación de tipos pasan.
- **Depende de:** ninguno técnico. **Bloqueado por la decisión de CA-16** (una zona del equipo o la de cada persona).

### FS-118.3: Regla de «vencida»
- **Tipo:** Modelo/Dominio
- **Capa:** lógica de dominio.
- **Hereda:** CA-3, CA-7, CA-8, CA-9, CA-10, CA-12 y CA-13.
- **Definition of Done:**
  - [ ] Cada criterio heredado tiene al menos una prueba unitaria con su DADO/CUANDO/ENTONCES.
  - [ ] Se prueba que «vencida» no cambia el estado de la tarea (CA-12).
  - [ ] Se prueba el paso a «hecho» y la reapertura (CA-9 y CA-10).
  - [ ] La regla vive en el modelo y no en controladores.
  - [ ] Usa los alias de importación del proyecto.
  - [ ] Lint y comprobación de tipos pasan.
- **Depende de:** FS-118.1 y FS-118.2. CA-13 necesita además que exista el archivado (externo).

### FS-118.4: Validar la fecha al guardarla
- **Tipo:** Modelo/Dominio
- **Capa:** lógica de dominio y validación.
- **Hereda:** CA-15 y CA-14.
- **Definition of Done:**
  - [ ] Una fecha inexistente, como el 31 de febrero, se rechaza con un mensaje en castellano, y la tarea conserva su fecha anterior.
  - [ ] Una fecha pasada se trata como decida CA-14, con pruebas para el caso aceptado y para el rechazado.
  - [ ] Los validadores siguen el estilo de los existentes.
  - [ ] Lint y comprobación de tipos pasan.
- **Depende de:** FS-118.1. **CA-14 está bloqueado por su decisión** (permitir o rechazar fechas ya pasadas).

### FS-118.5: Crear una tarea con fecha de vencimiento opcional
- **Tipo:** Endpoint/API
- **Capa:** endpoint, ampliando el de crear tarea.
- **Hereda:** CA-1, CA-2 y CA-14.
- **Definition of Done:**
  - [ ] Una prueba funcional por cada criterio heredado.
  - [ ] La respuesta pasa por el transformer, con el envoltorio común.
  - [ ] Los errores de validación llegan en castellano y por campo.
  - [ ] Exige sesión iniciada.
  - [ ] Las pruebas aíslan la base de datos para no ensuciar la de desarrollo.
  - [ ] Los tipos generados del cliente se regeneran y se commitean.
  - [ ] Lint y comprobación de tipos pasan.
- **Depende de:** FS-118.4 y el endpoint de crear tarea (externo).

### FS-118.6: Cambiar o quitar la fecha de una tarea existente
- **Tipo:** Endpoint/API
- **Capa:** endpoint, ampliando el de editar tarea.
- **Hereda:** CA-4, CA-5, CA-6, CA-15 y CA-18.
- **Definition of Done:**
  - [ ] Una prueba funcional por cada criterio heredado.
  - [ ] Cualquier miembro puede modificar la fecha de cualquier tarea activa, sin pedir justificación (CA-18).
  - [ ] Los errores de validación llegan en castellano y por campo.
  - [ ] Exige sesión iniciada.
  - [ ] Las pruebas aíslan la base de datos.
  - [ ] Los tipos generados del cliente se regeneran y se commitean.
  - [ ] Lint y comprobación de tipos pasan.
- **Depende de:** FS-118.4 y el endpoint de editar tarea (externo).

### FS-118.7: Informar de la condición de vencida al listar
- **Tipo:** Endpoint/API
- **Capa:** endpoint, ampliando el de listar tareas y el de archivadas.
- **Hereda:** CA-3, CA-7, CA-8, CA-13 y CA-19.
- **Definition of Done:**
  - [ ] Una prueba funcional por cada criterio heredado.
  - [ ] La condición de vencida y la fecha salen en cada tarea, vía el transformer.
  - [ ] Se prueba que sigue saliendo al filtrar por estado (CA-19).
  - [ ] Todos los miembros reciben el mismo resultado para la misma tarea.
  - [ ] Las pruebas aíslan la base de datos.
  - [ ] Los tipos generados del cliente se regeneran y se commitean.
  - [ ] Lint y comprobación de tipos pasan.
- **Depende de:** FS-118.3, el endpoint de listar (externo) y FS-142 para CA-19.

### FS-118.8: Campo de fecha en el formulario de crear tarea
- **Tipo:** Frontend
- **Capa:** interfaz de usuario.
- **Hereda:** CA-1, CA-2, CA-14 y CA-15.
- **Definition of Done:**
  - [ ] La fecha es opcional: no se pide nada más para crear sin ella.
  - [ ] Los errores de campo se muestran con su mensaje en castellano.
  - [ ] Toda llamada a la API pasa por el módulo único de acceso a la API.
  - [ ] Usa componentes de la librería de interfaz ya instalados, sin editarlos a mano.
  - [ ] La compilación con comprobación de tipos, el lint y el formateo pasan.
  - [ ] Pruebas automáticas si ya hay ejecutor. Si no, comprobación manual de CA-1, CA-2 y CA-15 anotada en el ticket.
- **Depende de:** FS-118.5 y el formulario de crear tarea (externo).

### FS-118.9: Cambiar o quitar la fecha desde una tarea existente
- **Tipo:** Frontend
- **Capa:** interfaz de usuario.
- **Hereda:** CA-4, CA-5, CA-6, CA-15 y CA-18.
- **Definition of Done:**
  - [ ] Se puede poner, cambiar y quitar la fecha sin pasos extra ni justificación.
  - [ ] Los errores de campo se muestran en castellano, y la fecha anterior se conserva si falla.
  - [ ] Toda llamada a la API pasa por el módulo único de acceso a la API.
  - [ ] La compilación con comprobación de tipos, el lint y el formateo pasan.
  - [ ] Pruebas automáticas si ya hay ejecutor. Si no, comprobación manual anotada en el ticket.
- **Depende de:** FS-118.6 y la edición de tareas en la interfaz (externo).

### FS-118.10: Mostrar la fecha y la marca de vencida en la lista
- **Tipo:** Frontend
- **Capa:** interfaz de usuario.
- **Hereda:** CA-1, CA-3, CA-7, CA-8, CA-9, CA-10, CA-12, CA-13 y CA-19.
- **Definition of Done:**
  - [ ] La marca de vencida se distingue sin depender solo del color.
  - [ ] El estado de la tarea se sigue viendo igual (CA-12).
  - [ ] La marca se mantiene al filtrar (CA-19) y se ve la fecha, sin marca, en archivadas (CA-13).
  - [ ] La compilación con comprobación de tipos, el lint y el formateo pasan.
  - [ ] Pruebas automáticas si ya hay ejecutor. Si no, comprobación manual de cada criterio anotada en el ticket.
- **Depende de:** FS-118.7, y de la lista en la interfaz (externo).

### FS-118.11: Pruebas de aceptación de los escenarios que cruzan capas
- **Tipo:** Test
- **Capa:** pruebas de extremo a extremo.
- **Hereda:** CA-10, CA-11, CA-16 y CA-9, los que dependen del tiempo y del estado a la vez.
- **Definition of Done:**
  - [ ] Cada escenario está escrito con su DADO/CUANDO/ENTONCES.
  - [ ] Las pruebas son deterministas: controlan el «hoy» y no dependen del reloj real.
  - [ ] Son independientes del orden y aíslan la base de datos.
  - [ ] Pasan en local con el comando de pruebas del proyecto.
- **Depende de:** FS-118.3, FS-118.7 y FS-118.10.

## Orden de entrega

```
FS-118.1 ─┬─ FS-118.4 ─┬─ FS-118.5 ── FS-118.8
          │            └─ FS-118.6 ── FS-118.9
FS-118.2 ─┴─ FS-118.3 ── FS-118.7 ── FS-118.10 ── FS-118.11
```

## Cosas a vigilar

- **CA-17 no tiene ticket.** La propuesta mínima, que se vea vencida «al volver a cargar», la cubre FS-118.7 sin trabajo extra. Si se decide que debe verse sin recargar, aparece un ticket nuevo y depende de la frescura de E3.
- **Decisiones que bloquean.** FS-118.2 espera a CA-16 y FS-118.4 espera a CA-14. Hasta que se resuelvan, pueden prepararse pero no cerrarse.
- **Si hay que recortar,** el alcance dice que la fecha cae primero. Los tickets que sobrevivirían con solo «poner la fecha al crear» son FS-118.1, 118.4, 118.5 y 118.8, más lo mínimo de 118.3 y 118.7.
