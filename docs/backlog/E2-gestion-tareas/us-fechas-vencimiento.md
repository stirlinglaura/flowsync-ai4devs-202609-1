# Fecha de vencimiento y tareas vencidas

**Identificador:** FS-118

**Historia.** Como miembro del equipo, quiero poner, cambiar o quitar una fecha de vencimiento opcional en una tarea, y ver cuáles se han pasado de plazo, para detectar de un vistazo lo atrasado sin revisar fechas una a una.

**Marcas de los criterios:** `[PRD]` ya está en el PRD, con su requisito. `[PROPUESTO]` lo añadió Claude para revisión. `[DECISIÓN]` necesita que el equipo elija, porque el PRD no lo resuelve.

## Criterios de aceptación

### Camino feliz

**CA-1. Crear con una fecha futura** `[PRD · RF-6]`
- DADO que estoy creando una tarea
- CUANDO indico un título, un responsable y una fecha de vencimiento futura
- ENTONCES la tarea aparece en la lista con esa fecha y **no** se muestra como vencida.

**CA-2. Crear sin fecha** `[PRD · RF-6]`
- DADO que estoy creando una tarea
- CUANDO indico solo título y responsable, sin fecha
- ENTONCES la tarea se crea sin pedirme nada más y se muestra sin fecha.

**CA-3. Una tarea con fecha pasada se ve como vencida** `[PRD · RF-13]`
- DADO una tarea en «pendiente» o «en curso» con fecha de vencimiento anterior a hoy
- CUANDO miro la lista
- ENTONCES esa tarea se muestra como vencida, igual que la ven los demás miembros.

**CA-4. Poner fecha a una tarea que no la tenía** `[PRD · RF-10, supuesto]`
- DADO una tarea activa sin fecha de vencimiento
- CUANDO le pongo una fecha
- ENTONCES la tarea muestra esa fecha, y se ve vencida solo si la fecha es anterior a hoy.

**CA-5. Cambiar la fecha** `[PRD · RF-10, supuesto]`
- DADO una tarea activa con fecha de vencimiento
- CUANDO la cambio por otra
- ENTONCES la tarea muestra la nueva fecha, y su condición de vencida se recalcula con ella.

**CA-6. Quitar la fecha** `[PRD · RF-10, supuesto]`
- DADO una tarea activa con fecha de vencimiento, esté o no vencida
- CUANDO quito la fecha
- ENTONCES la tarea queda sin fecha y deja de mostrarse como vencida.

### Cuándo una tarea es vencida y cuándo no

**CA-7. Sin fecha nunca es vencida** `[PRD · RF-13]`
- DADO una tarea sin fecha de vencimiento
- CUANDO pasa el tiempo, por mucho que sea
- ENTONCES nunca se muestra como vencida.

**CA-8. Una tarea hecha no se ve vencida** `[PRD · RF-13, supuesto]`
- DADO una tarea en «hecho» con fecha de vencimiento anterior a hoy
- CUANDO miro la lista
- ENTONCES **no** se muestra como vencida.

**CA-9. Terminar una tarea vencida la libera** `[PROPUESTO]`
- DADO una tarea vencida
- CUANDO la paso a «hecho»
- ENTONCES deja de mostrarse como vencida, y conserva su fecha.

**CA-10. Reabrir una tarea con fecha pasada la vuelve a marcar** `[PROPUESTO]`
- DADO una tarea en «hecho» con fecha de vencimiento anterior a hoy
- CUANDO la devuelvo a «pendiente» o «en curso»
- ENTONCES vuelve a mostrarse como vencida.

**CA-11. El día de la fecha todavía no es vencida** `[PROPUESTO]`
- DADO una tarea con fecha de vencimiento igual a hoy
- CUANDO miro la lista ese mismo día
- ENTONCES **no** se muestra como vencida, y pasa a mostrarse vencida a partir del día siguiente.

**CA-12. Vencida no es un estado nuevo** `[PROPUESTO]`
- DADO una tarea vencida en «en curso»
- CUANDO miro su estado
- ENTONCES sigue en «en curso». Vencida es una señal visual añadida, no un cuarto estado.

**CA-13. Una archivada no se ve como vencida** `[PROPUESTO]`
- DADO una tarea con fecha pasada que se archiva
- CUANDO la veo en la vista de archivadas
- ENTONCES muestra su fecha, pero **no** aparece como vencida.

### Edge cases y errores

**CA-14. Crear con una fecha que ya pasó** `[DECISIÓN]`
- DADO que estoy creando una tarea
- CUANDO indico una fecha anterior a hoy
- ENTONCES la tarea se crea y se muestra vencida desde el principio, sin bloquearme.
- Propuesta: permitirlo, porque puede ser trabajo que ya va tarde. La alternativa es rechazarlo con un aviso.

**CA-15. Una fecha que no existe** `[PROPUESTO]`
- DADO que estoy poniendo una fecha
- CUANDO escribo algo que no es una fecha real, como el 31 de febrero
- ENTONCES no se guarda y me avisa en castellano de que la fecha no es válida, y la tarea conserva su fecha anterior, si tenía.

**CA-16. Todos ven lo mismo, también entre husos horarios** `[DECISIÓN]`
- DADO un equipo repartido en varios husos horarios
- CUANDO dos miembros miran la misma tarea en el mismo momento
- ENTONCES ambos la ven vencida o ambos la ven no vencida.
- El PRD no define en qué zona es «hoy». Propuesta: una única zona horaria del equipo. La alternativa, la zona de cada persona, da resultados distintos según quién mira.

**CA-17. Cuando cambia el día** `[DECISIÓN]`
- DADO una tarea con fecha de vencimiento igual a hoy y una lista abierta
- CUANDO empieza el día siguiente
- ENTONCES la tarea pasa a mostrarse vencida como mucho al volver a cargar la lista, sin que nadie haya tocado la tarea.
- Propuesta mínima: la frescura de E3 cubre cambios que hacen otras personas, y no esto. Si se quiere que se vea sin recargar, hay que decirlo.

**CA-18. Cualquiera puede ponerla, cambiarla o quitarla** `[PRD · RF-10, supuesto]`
- DADO cualquier miembro del equipo y una tarea activa, sea suya o de otra persona
- CUANDO modifico su fecha
- ENTONCES se permite sin pedir permiso ni justificación, y los demás ven la nueva fecha.

**CA-19. Una tarea vencida se sigue viendo vencida al filtrar** `[PROPUESTO]`
- DADO una tarea vencida en «en curso»
- CUANDO filtro la lista por «en curso»
- ENTONCES esa tarea sigue mostrándose como vencida.
