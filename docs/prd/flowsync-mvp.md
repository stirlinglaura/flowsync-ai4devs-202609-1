# PRD: FlowSync MVP

- **Estado:** borrador
- **Fecha:** 2026-10-03
- **Base:** [`alcance-mvp.md`](./alcance-mvp.md), el alcance consensuado. Si este documento y esa base discrepan, manda la base hasta que se corrija aquí.
- **Convención:** lo que no está confirmado por el alcance consensuado va marcado como **[SUPUESTO]**. No hay cifras de mercado en este documento.

## 1. Problema y contexto

En un equipo remoto pequeño nadie ve qué hace el resto sin interrumpir a alguien. Hoy eso se paga con:

- La ronda de «¿en qué estás?» de la daily, que se come la mitad de los 15 minutos.
- El goteo de preguntas por Slack o chat.
- Trabajo duplicado. Caso concreto: dos personas tocaron el mismo módulo la misma semana, una sin saber que la otra ya había empezado. Dos días perdidos.

La daily **no desaparece entera**: la parte de bloqueos sigue y este MVP no la resuelve. Lo que el MVP intenta eliminar es solo la ronda de «¿en qué estás?».

**Contexto del producto.** FlowSync es hoy una aplicación con cuentas y acceso, y sin ninguna funcionalidad de tareas. Todo lo relativo a tareas es nuevo.

**Primer usuario.** Un equipo de 6 personas de producto SaaS, en 3 husos horarios, que hoy usa un gestor de tareas pesado y una daily de 15 minutos por videollamada. Es un **caso de estudio, no un cliente real**. Todo lo de este documento es hipótesis hasta que un equipo real lo use una semana.

## 2. Usuarios y jobs-to-be-done

**Usuario:** los pares de un equipo remoto de 3 a 10 personas, con roles planos. En el MVP todos ven y editan lo mismo. No hay reporte hacia arriba ni un rol de manager.

| # | Cuando… | Quiero… | Para… |
|---|---|---|---|
| JTBD-1 | llego por la mañana o vuelvo de una reunión | ver qué se ha movido y qué está en curso, sin preguntar a nadie | ponerme al día sin interrumpir ni ser interrumpido |
| JTBD-2 | voy a elegir qué coger a continuación | ver qué tiene ya en curso otra persona y qué queda pendiente | no empezar algo que otro ya está tocando |
| JTBD-3 | empiezo, cambio o termino algo | reflejarlo en la lista en segundos | que el equipo lo vea y que nadie me pregunte cómo voy |
| JTBD-4 | una tarea deja de tener sentido | sacarla de mi lista dejando constancia de que se descartó | no mezclar lo abandonado con lo terminado |

## 3. Propuesta de valor

Abres FlowSync y ves de un vistazo qué hace cada persona y qué queda por coger. No empiezas algo que otra persona ya tiene en curso, y dejas de hacer o recibir la pregunta «¿en qué estás?».

- **El estado es de la tarea, no de la persona.** No hay presencia ni indicadores de actividad: eso es vigilancia y se rechaza a propósito.
- **Resumen que espera, no aviso que interrumpe.** No hay notificaciones push. La lista está al día cuando la abres.
- **Quien escribe, cobra en el momento.** El estado lo teclea quien hace la tarea, en dos clics. Esa misma lista es su cola de trabajo y, al mantenerla, deja de recibir interrupciones.
- **Sustituye al gestor de tareas, no convive con él.** FlowSync crea las tareas y no lee las de otro sitio.

**Riesgo #1.** Si la información se queda vieja, el producto pierde el sentido. Es el primer riesgo a validar. La mitigación es que actualizar cueste dos clics, no obligar a nadie.

## 4. Alcance / Fuera de alcance

### Dentro

1. Lista única compartida que todos ven y editan. Un solo espacio, sin entidad «equipo».
2. Tarea con título, responsable (obligatorio) y fecha de vencimiento (opcional).
3. Tres estados fijos y no configurables: pendiente, en curso y hecho.
4. Crear una tarea y cambiarle el estado en dos clics.
5. Filtrar por estado.
6. Ver los cambios de otros sin recargar, con 5 a 10 segundos de frescura.
7. «Actualizada hace X» visible en cada tarea, sin guardar nada por persona.
8. Archivar una tarea con un mensaje opcional, y una vista de archivadas.
9. Acceso solo para el equipo, apoyado en la autenticación que ya existe.
10. El trabajo llega con tests.

**Orden de construcción:** primero la lista compartida con sus tres estados, usable de punta a punta; después la frescura. **Recorte:** si hay que recortar, la fecha de vencimiento cae primero.

### Fuera

| Excluido | Por qué |
|---|---|
| Estado «bloqueado» | Es la mitad de la daily que se declara no resuelta. |
| Comentarios en tareas | Sin ellos los bloqueos siguen en la daily. Añadirlos abre un segundo producto. |
| Notificaciones push | El valor es un resumen que espera, no un aviso que interrumpe. |
| Presencia e indicadores de actividad de personas | Es vigilancia y se rechaza a propósito. |
| Sync en tiempo real estricto | Con 5 a 10 segundos el valor es el mismo, y con 3 husos horarios hay poco solape en directo. |
| «Desde mi última visita» por persona | Guarda un dato por persona para un beneficio que «actualizada hace X» cubre casi igual de barato. |
| Integración con Slack | FlowSync es donde se hace el trabajo, no donde se cuenta. |
| Derivar el estado desde Git, PRs, CI o calendario | Es otro producto, con integraciones de terceros. |
| Convivir con otro gestor de tareas | Obliga a doble actualización. |
| Roles y permisos avanzados | Roles planos: una jerarquía contradice la premisa de pares. |
| Analítica y reporting | Nadie hacia arriba pide informes. |
| Sprints, estimaciones, épicas y backlog priorizado | Es el «rollo» de Jira. |
| Varios equipos, o gente en más de uno | Un espacio único por instalación. |
| Borrar tareas y restaurar archivadas | Archivar cubre la salida de una tarea. |
| Etiquetas, prioridad, subtareas y adjuntos | No cambian la decisión que el producto facilita. |
| Chat, videollamada y edición simultánea | Son otro producto. |

## 5. Épicas del MVP

- **E1 · Cuentas y acceso:** que solo las personas del equipo puedan entrar y salir de FlowSync.
- **E2 · Gestión de tareas:** crear, asignar, cambiar de estado, filtrar y archivar las tareas de la lista compartida.
- **E3 · Actividad del equipo:** ver lo que se ha movido, sin recargar y con la antigüedad de cada cambio a la vista.

> **Nota sobre E3.** En el alcance consensuado, el sync en tiempo real estricto queda fuera. E3 cubre la frescura de 5 a 10 segundos y el «actualizada hace X» de cada tarea, y nada de presencia ni de aviso.

## 6. Requisitos funcionales (a nivel producto)

Cada requisito se puede comprobar con una prueba de aceptación.

### E1 · Cuentas y acceso

- **RF-1.** Una persona del equipo puede crearse una cuenta. **[SUPUESTO]** La entrada está limitada a quien el equipo invite, y cualquiera que no haya sido invitado no puede crear una cuenta. El mecanismo concreto de invitación se decide en la spec.
- **RF-2.** Una persona con cuenta puede iniciar sesión con su correo y su contraseña, y cerrar sesión.
- **RF-3.** Una persona con sesión puede ver los datos de su propia cuenta.
- **RF-4.** Quien no ha iniciado sesión no ve ninguna tarea ni ningún dato del equipo, y se le lleva a iniciar sesión.

### E2 · Gestión de tareas

- **RF-5.** Cualquier miembro puede crear una tarea indicando un título y un responsable, que son obligatorios. No se puede crear una tarea sin alguno de los dos.
- **RF-6.** Al crear una tarea se puede indicar una fecha de vencimiento, que es opcional.
- **RF-7.** El responsable puede ser cualquier miembro del equipo, incluido quien crea la tarea.
- **RF-8.** Toda tarea nueva empieza en el estado «pendiente».
- **RF-9.** Cualquier miembro puede cambiar el estado de cualquier tarea activa entre los tres estados fijos (pendiente, en curso y hecho), en no más de dos clics desde la lista abierta. **[SUPUESTO]** Se puede cambiar en ambos sentidos, también de «hecho» a otro estado.
- **RF-10.** **[SUPUESTO]** Cualquier miembro puede cambiar el título, el responsable y la fecha de vencimiento de una tarea activa. El alcance consensuado no menciona editar: se incluye porque, sin ello, coger la tarea de otro o corregir una errata obliga a archivar y recrear. Si hay que recortar, lo mínimo es poder cambiar el responsable.
- **RF-11.** La lista muestra todas las tareas activas, con su título, responsable, estado, fecha de vencimiento si la hay, y el tiempo desde su último cambio.
- **RF-12.** La lista se puede filtrar por estado, y al quitar el filtro muestra todas las activas.
- **RF-13.** Una tarea con fecha de vencimiento anterior a hoy y que no está en «hecho» se muestra como vencida. Una tarea sin fecha nunca se muestra como vencida. **[SUPUESTO]** Una tarea en «hecho» tampoco se muestra como vencida.
- **RF-14.** Cualquier miembro puede archivar una tarea desde cualquiera de los tres estados, con un mensaje opcional. Se puede archivar sin escribir mensaje.
- **RF-15.** Una tarea archivada desaparece de la lista activa y de los filtros por estado, y no cuenta como «hecho».
- **RF-16.** Existe una vista de tareas archivadas que muestra, para cada una, su título, su responsable, el mensaje de archivado si lo hay y quién la archivó.
- **RF-17.** En el MVP no se puede borrar una tarea ni restaurar una archivada.

### E3 · Actividad del equipo

- **RF-18.** Cuando otro miembro crea, modifica, cambia de estado o archiva una tarea, quien tiene la lista abierta ve el cambio sin recargar la página, como mucho 10 segundos después.
- **RF-19.** Cada tarea muestra el tiempo transcurrido desde su último cambio («actualizada hace X»), y ese dato es igual para todos los miembros.
- **RF-20.** **[SUPUESTO]** La lista activa se ordena por último cambio, la más reciente arriba, para que lo que se ha movido quede a la vista al volver.
- **RF-21.** El sistema no muestra quién está conectado ni ningún indicador de actividad de las personas, y no envía notificaciones push.

## 7. Requisitos no funcionales

- **RNF-1. Frescura.** Un cambio hecho por una persona es visible para el resto en un máximo de 10 segundos, y el objetivo es de 5 a 10.
- **RNF-2. Esfuerzo de uso.** Crear una tarea y cambiarle el estado cuesta dos clics sobre la lista ya abierta, sin campos obligatorios más allá de título y responsable. La justificación al archivar no es obligatoria.
- **RNF-3. Privacidad.** El estado pertenece a la tarea. El sistema no guarda ni muestra información sobre cuándo estuvo cada persona conectada o qué miró.
- **RNF-4. Acceso.** Ninguna información del equipo es accesible sin iniciar sesión.
- **RNF-5. Capacidad.** **[SUPUESTO]** El MVP debe funcionar con equipos de hasta 10 personas, sin objetivos de rendimiento para equipos mayores.
- **RNF-6. Idioma.** **[SUPUESTO]** La interfaz y los mensajes de error están en castellano, como el resto de la aplicación.
- **RNF-7. Navegadores.** **[SUPUESTO]** Navegadores de escritorio actuales. No se hace trabajo específico para móvil en el MVP.
- **RNF-8. Calidad.** Cada capacidad llega con pruebas automáticas, y una capacidad sin pruebas no se da por terminada.

## 8. Restricciones

- **Stack:** AdonisJS 7 en el backend y React 19 en el frontend. No se cambia en el MVP.
- **Autenticación existente:** el alta, el inicio y cierre de sesión y la consulta de la propia cuenta ya existen y no se rehacen. Hoy cualquiera puede crear una cuenta, y RF-1 exige cambiar eso.
- **Sin tareas todavía:** no existe ninguna funcionalidad de tareas. Se construye desde cero.
- **Pruebas:** el backend tiene configurado su ejecutor de pruebas, pero aún no hay ninguna prueba. El frontend no tiene ejecutor de pruebas instalado, así que cumplir RNF-8 también ahí obliga a incorporar uno.
- **Una instalación por equipo:** el MVP asume un solo equipo, sin entidad «equipo» ni gente en más de un equipo.
- **Orden de entrega:** la lista compartida se termina de punta a punta antes de empezar la frescura. Una capacidad terminada antes que tres a medias.

## 9. Métricas de éxito

**Métrica principal.** A la semana de uso real, el equipo cancela la ronda de «¿en qué estás?» de la daily y nadie pide que vuelva. Si la siguen haciendo igual, el MVP no ha funcionado. Que los bloqueos se sigan tratando en la daily no cuenta como fallo.

**Métricas de apoyo**

| Métrica | Cómo se comprueba | Umbral |
|---|---|---|
| Interrupciones por «¿en qué estás?» en chat | Recuento de esas preguntas en la semana de uso frente a la semana anterior | **[SUPUESTO]** Baja respecto a la línea base. No se fija cifra hasta medir la base |
| Solapes de trabajo | El equipo cuenta los casos de dos personas haciendo lo mismo sin saberlo | **[SUPUESTO]** Cero casos en la semana de uso |
| Información vieja (riesgo #1) | Proporción de tareas «en curso» sin cambios desde hace más de 3 días | **[SUPUESTO]** Menos del 20 %. Ambas cifras son de partida y se ajustan con datos |
| Esfuerzo de actualizar | Prueba manual: clics para cambiar de estado una tarea desde la lista abierta | No más de 2 clics (RNF-2) |
| Frescura | Prueba: cambio hecho por una persona y tiempo hasta verlo otra | Como máximo 10 segundos (RNF-1) |
| Uso del mensaje de archivado | Proporción de tareas archivadas con mensaje | **[SUPUESTO]** Si más de la mitad se archivan sin mensaje, la vista de archivadas aporta poco y se revisa si exigirlo |

**Límites de la medición.** Con un caso de estudio de 6 personas no hay significación estadística. Estas métricas sirven para decidir si seguir, y no para demostrar un efecto.
