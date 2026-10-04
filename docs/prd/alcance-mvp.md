# Alcance del MVP de FlowSync

Alcance consensuado, base del PRD. Es un documento de producto: modelo de datos, endpoints, estados internos y latencias de implementación se deciden en la spec, no aquí.

## 1. Problema

En un equipo remoto pequeño nadie ve qué hace el resto sin interrumpir a alguien. Hoy eso se paga con:

- La ronda de «¿en qué estás?» de la daily, que se come la mitad de los 15 minutos.
- El goteo constante de preguntas por Slack o chat.
- Trabajo duplicado. Caso concreto: dos personas tocaron el mismo módulo la misma semana, una sin saber que la otra ya había empezado. Dos días perdidos.

La daily **no desaparece entera**: la parte de bloqueos sigue y este MVP no la resuelve.

## 2. Usuarios

- **Quien cobra el valor:** los pares de equipos remotos de 3 a 10 personas, con roles planos. En el MVP todos ven y editan lo mismo, sin jerarquía de permisos. No hay reporte hacia arriba y a un manager le daría igual.
- **Primer usuario:** un equipo de 6 personas de producto SaaS, en 3 husos horarios, que hoy usa un gestor de tareas pesado y una daily de 15 minutos por videollamada.
- **Aviso:** este equipo es un **caso de estudio, no un cliente real**. Todo lo de este documento es hipótesis hasta que un equipo real lo use una semana.

## 3. Propuesta de valor

Abres FlowSync y ves de un vistazo qué hace cada persona y qué queda por coger. No empiezas algo que otra persona ya tiene en curso, y dejas de hacer o recibir la pregunta «¿en qué estás?».

- **El estado es de la tarea, no de la persona.** Sin presencia ni indicadores de actividad: eso es vigilancia y se rechaza a propósito.
- **Resumen que espera, no aviso que interrumpe.** Llegas por la mañana o vuelves de una reunión y ves qué se ha movido.
- **Quien escribe, cobra en el momento.** El estado lo teclea quien hace la tarea, en dos clics. Esa misma lista es su cola de trabajo y, al mantenerla, deja de recibir interrupciones.
- **Sustituye al gestor de tareas, no convive con él.** FlowSync crea las tareas y no lee las de otro sitio. Convivir exigiría doble actualización, que es como muere esta categoría.

### Cómo sabemos que funciona

A la semana de uso real, el equipo cancela la ronda de «¿en qué estás?» y nadie pide que vuelva. Si la siguen haciendo igual, no funcionó.

### Riesgo #1

Si la información se queda vieja, el producto pierde el sentido. Es el primer riesgo a validar, no un detalle. La mitigación es que actualizar cueste dos clics, no obligar a nadie.

## 4. Alcance (IN)

1. **Lista única compartida** que todos ven y editan. Un solo espacio, sin entidad «equipo».
2. **Tarea** con título, **responsable (obligatorio)** y **fecha de vencimiento (opcional)**. Sin fecha, una tarea nunca aparece como vencida.
3. **Tres estados fijos y no configurables:** pendiente, en curso y hecho. «En curso» es la señal que el producto existe para transmitir. Los nombres exactos bajan a la spec.
4. **Crear una tarea y cambiarle el estado en dos clics**, sin flujos de configuración ni campos extra.
5. **Filtrar por estado** para centrarse en lo pendiente.
6. **Ver los cambios sin recargar ni preguntar**, con 5 a 10 segundos de frescura.
7. **«Actualizada hace X»** visible en cada tarea, para ver qué se ha movido al volver. No se guarda nada por persona.
8. **Archivar una tarea con un mensaje opcional.**
   - Archivar no es «hecho»: hecho es trabajo completado, archivada es trabajo descartado.
   - Archivar no es un cuarto estado: la tarea sale de la lista activa y de los filtros.
   - Se puede archivar desde cualquier estado, y cualquiera puede hacerlo.
   - Hay una **vista de archivadas** con el mensaje, si lo hay, y quién la archivó.
9. **Acceso solo para el equipo**, apoyado en la autenticación que ya existe (alta, login, perfil, logout).
10. **El trabajo llega con tests.** Una capability sin tests no se da por terminada.

### Orden de construcción

Una capability terminada antes que tres a medias:

1. La lista compartida con sus tres estados, usable de punta a punta.
2. La frescura: los cambios aparecen solos en unos segundos.

### Recorte si hay que recortar

La fecha de vencimiento es lo primero que cae: es opcional y no es la señal central.

### Límites asumidos

- Una tarea pendiente con responsable significa «planeada para esa persona», no «libre». Una tarea realmente sin dueño no entra en el MVP.
- Una tarea con solo título puede no evitar el solape «en el mismo módulo»: depende de que los títulos sean descriptivos. Se valida en el caso de estudio.
- El mensaje de archivado es opcional. Si en el caso de estudio sale casi siempre vacío, la vista de archivadas aporta poco y habría que volver a exigirlo.
- No se puede restaurar una tarea archivada. Si se archivó mal, se crea otra. Es lo primero que se añadiría si el caso de estudio lo echa en falta.
- Varios equipos separados, o gente en más de uno, queda fuera y se anota aquí como supuesto: el MVP asume un único equipo por instalación, con acceso solo para quien el equipo invite. El mecanismo concreto de invitación se decide en la spec.

## 5. NO-alcance (OUT)

| Excluido | Por qué |
|---|---|
| Estado «bloqueado» | Es la mitad de la daily que se declara no resuelta. Meterlo prometería más de lo que cumple el MVP. |
| Comentarios en tareas | Sin ellos los bloqueos siguen en la daily. Añadirlos abre un segundo producto (conversación). |
| Notificaciones push | El valor es un resumen que espera, no un aviso que interrumpe. Push convertiría esto en otro canal de ruido. |
| Presencia («quién está conectado») e indicadores de actividad | Es vigilancia y se rechaza a propósito. |
| Sync en tiempo real estricto | Con 5 a 10 segundos el valor es el mismo para este caso, y con 3 husos horarios hay poco solape en directo. |
| «Desde mi última visita» por persona | Guarda un dato por persona para un beneficio que «actualizada hace X» cubre casi igual de barato. |
| Integración con Slack | FlowSync es donde se hace el trabajo, no donde se cuenta. |
| Derivar el estado desde Git, PRs, CI o calendario | Es otro producto, con integraciones y OAuth de terceros. En el MVP lo teclea quien hace la tarea. |
| Convivir con otro gestor de tareas | Obliga a doble actualización. FlowSync sustituye, no complementa. |
| Roles y permisos avanzados | Roles planos. Una jerarquía contradice la premisa de pares. |
| Analítica y reporting | Nadie hacia arriba pide informes. |
| Sprints, estimaciones, épicas y backlog priorizado | Es el «rollo» de Jira. Un equipo que lo necesite no es nuestro usuario. |
| Varios equipos, o gente en más de uno | Un espacio único. Queda anotado como supuesto. |
| Borrar tareas y restaurar archivadas | Archivar cubre la salida de una tarea. Restaurar y borrar implican políticas que ahora no hacen falta. |
| Etiquetas, prioridad, subtareas y adjuntos | No cambian la decisión que el producto existe para facilitar: qué está en curso y qué queda por coger. |
| Chat, videollamada y edición simultánea | Son otro producto. |
