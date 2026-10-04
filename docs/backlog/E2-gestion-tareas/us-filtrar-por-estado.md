# Filtrar las tareas por estado

**Identificador:** FS-142

**Historia.** Como miembro del equipo, quiero filtrar la lista de tareas por estado (pendiente, en curso o hecho), para centrarme en lo pendiente sin ver lo demás.

**Marcas de los criterios:** `[PRD]` ya está en el PRD, con su requisito. `[PROPUESTO]` lo añadió Claude para revisión. `[DECISIÓN]` necesita que el equipo elija, porque el PRD no lo resuelve.

## Criterios de aceptación

### Camino feliz

**CA-1. Filtrar por pendiente** `[PRD · RF-12]`
- DADO que hay tareas en varios estados
- CUANDO filtro por «pendiente»
- ENTONCES solo veo las tareas en «pendiente».

**CA-2. Filtrar por en curso** `[PRD · RF-12]`
- DADO que hay tareas en varios estados
- CUANDO filtro por «en curso»
- ENTONCES solo veo las tareas en «en curso».

**CA-3. Filtrar por hecho** `[PRD · RF-12]`
- DADO que hay tareas en varios estados
- CUANDO filtro por «hecho»
- ENTONCES solo veo las tareas en «hecho».

**CA-4. Quitar el filtro** `[PRD · RF-12]`
- DADO que tengo un filtro aplicado
- CUANDO lo quito
- ENTONCES veo de nuevo todas las tareas activas.

**CA-5. Sin filtro, se ve todo** `[PRD · RF-12]`
- DADO que abro la lista sin haber filtrado
- CUANDO se muestra
- ENTONCES veo todas las tareas activas, sin ningún estado preseleccionado.

### Reglas del filtro

**CA-6. Solo existen tres estados para filtrar** `[PRD · estados fijos]`
- DADO que voy a elegir un filtro
- CUANDO veo las opciones
- ENTONCES son exactamente pendiente, en curso y hecho, y ningún equipo puede añadir ni cambiar otras.

**CA-7. Las archivadas no aparecen en ningún filtro** `[PRD · RF-15]`
- DADO una tarea archivada que estuvo en cualquiera de los tres estados
- CUANDO filtro por cualquier estado, o no filtro
- ENTONCES esa tarea no aparece.

**CA-8. Todos ven el mismo resultado** `[PROPUESTO]`
- DADO la lista única compartida
- CUANDO dos miembros aplican el mismo filtro en el mismo momento
- ENTONCES ven las mismas tareas.

**CA-9. Filtrar no cambia nada** `[PROPUESTO]`
- DADO una lista con tareas
- CUANDO aplico o quito un filtro
- ENTONCES no se modifica ninguna tarea, y las que se ven conservan su responsable, fecha y marca de vencida.

### Edge cases y errores

**CA-10. Un estado que no existe se avisa como error** `[PROPUESTO]`
- DADO que se pide un filtro por un estado que no existe, como «bloqueado» o uno mal escrito (por ejemplo desde un enlace guardado o compartido)
- CUANDO se intenta mostrar la lista
- ENTONCES recibo un aviso en castellano que dice que ese estado no existe e indica cuáles son los válidos (pendiente, en curso y hecho), y **no** se muestra una lista vacía ni un «no hay tareas» como si el filtro hubiera funcionado.

**CA-11. Qué se ve junto al aviso de error** `[DECISIÓN]`
- DADO el caso de CA-10
- CUANDO se muestra el aviso
- ENTONCES la lista no se presenta como filtrada.
- Propuesta: mostrar el aviso con los estados válidos para elegir uno, y no aplicar ningún filtro por detrás. Si se muestra la lista completa debajo, hay que dejar claro que no está filtrada. Pendiente de elegir entre mostrar solo el aviso o aviso más lista sin filtrar.

**CA-12. Un estado válido sin tareas no es un error** `[PROPUESTO]`
- DADO un estado válido en el que no hay ninguna tarea
- CUANDO filtro por él
- ENTONCES veo un mensaje claro de que no hay tareas en ese estado, distinto del aviso de CA-10.

**CA-13. Un filtro en blanco equivale a no filtrar** `[PROPUESTO]`
- DADO que se pide la lista sin indicar ningún estado
- CUANDO se muestra
- ENTONCES se comporta como CA-5 (todas las activas) y no como un error.

**CA-14. Cambiar el estado de una tarea con el filtro activo** `[PROPUESTO]`
- DADO que filtro por «pendiente»
- CUANDO paso una tarea a «en curso»
- ENTONCES esa tarea deja de verse en esa vista y el filtro sigue activo. No me devuelve a la lista completa.

**CA-15. Crear una tarea que no coincide con el filtro** `[DECISIÓN]`
- DADO que filtro por «hecho»
- CUANDO creo una tarea, que nace en «pendiente»
- ENTONCES la tarea se crea pero no se ve en esa vista.
- Propuesta: avisar de que se creó y de que no coincide con el filtro actual, para que nadie crea que falló. La alternativa es no avisar y aceptar la confusión.

**CA-16. El filtro al volver a abrir la lista** `[DECISIÓN]`
- DADO que tenía un filtro aplicado
- CUANDO vuelvo a abrir la lista más tarde
- ENTONCES veo todas las tareas, sin el filtro anterior.
- Propuesta: no recordarlo, porque el PRD no pide guardar nada por persona y el caso de uso es volver y ver todo. Si se quiere que se recuerde, es un dato por persona y hay que decirlo.

**CA-17. Sin sesión no se ve nada** `[PRD · RF-4]`
- DADO que no he iniciado sesión
- CUANDO intento ver la lista con cualquier filtro
- ENTONCES no veo ninguna tarea y me llevan a iniciar sesión.

**CA-18. Los cambios de otros respetan mi filtro** `[PROPUESTO]`
- DADO que tengo un filtro aplicado
- CUANDO otro miembro cambia una tarea y yo lo veo sin recargar
- ENTONCES la tarea aparece o desaparece según cumpla mi filtro.
- El plazo de verlo lo fija la frescura de E3, no esta historia.
