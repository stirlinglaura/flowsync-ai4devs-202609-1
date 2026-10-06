# Cuentas y acceso

## Purpose

Describe el comportamiento actual de Flowsync en el vertical de cuentas y acceso: registro, inicio y cierre de sesión, sesión, permisos y gestión de la cuenta. Se documenta en dos capas, API (requisitos "API:") y pantalla (requisitos "Pantalla:"), y solo lo observable desde fuera.

## Requirements

### Requirement: API: las respuestas correctas van envueltas en `data`

El sistema SHALL devolver en JSON las respuestas de éxito de registro, login y perfil, con el contenido dentro de una clave `data`. El usuario SHALL exponer solo `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials`, y nunca la contraseña. Todas las rutas cuelgan de `/api/v1`.

#### Scenario: Forma del usuario en una respuesta
- **WHEN** un endpoint de cuentas responde con éxito e incluye un usuario
- **THEN** el cuerpo es `{ "data": ... }` y el usuario contiene `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials`, sin ningún campo de contraseña

#### Scenario: Iniciales con nombre
- **WHEN** el usuario tiene `fullName` con al menos dos palabras
- **THEN** `initials` son en mayúsculas la primera letra de las dos primeras palabras

#### Scenario: Iniciales sin nombre
- **WHEN** el usuario no tiene `fullName`
- **THEN** `initials` se calcula a partir del email en mayúsculas (duda: el resultado exacto con emails sin nombre, y con nombres de una sola palabra, no está verificado por pruebas)

### Requirement: API: registro de cuenta nueva

El sistema SHALL permitir crear una cuenta con `POST /api/v1/auth/signup` sin autenticación, y devolver el usuario creado junto con un token de acceso, de modo que quien se registra queda con sesión iniciada.

#### Scenario: Registro correcto
- **WHEN** se envía `POST /api/v1/auth/signup` con `fullName` (texto o `null`), un `email` válido y no registrado, `password` de 8 a 32 caracteres y `passwordConfirmation` idéntica a `password`
- **THEN** responde 200 con `{ "data": { "user": {...}, "token": "<token opaco>" } }` y la cuenta queda creada

#### Scenario: Email ya registrado
- **WHEN** se envía el registro con un `email` que ya pertenece a otra cuenta
- **THEN** responde 422 con una lista `errors` donde un elemento tiene `field` igual a `email` y `rule` igual a `database.unique`, y no se crea cuenta

#### Scenario: Contraseña fuera de longitud
- **WHEN** se envía el registro con `password` de menos de 8 o más de 32 caracteres
- **THEN** responde 422 con un error sobre `password` de regla `minLength` o `maxLength`

#### Scenario: Confirmación distinta
- **WHEN** `passwordConfirmation` no coincide con `password`
- **THEN** responde 422 con un error sobre `passwordConfirmation` de regla `sameAs`

#### Scenario: Email inválido o demasiado largo
- **WHEN** el `email` no tiene formato de email o supera 254 caracteres
- **THEN** responde 422 con un error sobre `email` (regla `email` o `maxLength`)

#### Scenario: Faltan campos obligatorios
- **WHEN** falta `email`, `password`, `passwordConfirmation` o la clave `fullName` (que admite `null` pero debe enviarse)
- **THEN** responde 422 con un error de regla `required` por cada campo ausente

### Requirement: API: login

El sistema SHALL permitir iniciar sesión con `POST /api/v1/auth/login` sin autenticación, comprobando email y contraseña y emitiendo un token de acceso nuevo en cada login.

#### Scenario: Credenciales correctas
- **WHEN** se envía `POST /api/v1/auth/login` con el `email` y la `password` de una cuenta existente
- **THEN** responde 200 con `{ "data": { "user": {...}, "token": "<token opaco>" } }`

#### Scenario: Credenciales incorrectas
- **WHEN** el email no existe o la contraseña no corresponde a la cuenta
- **THEN** responde 400 con un error de credenciales inválidas, sin campo asociado, sin distinguir si falló el email o la contraseña

#### Scenario: Cuerpo mal formado
- **WHEN** falta `email` o `password`, o el `email` no tiene formato válido
- **THEN** responde 422 con errores de validación por campo

#### Scenario: Varias sesiones simultáneas
- **WHEN** la misma cuenta hace login dos veces
- **THEN** se emiten dos tokens distintos y ambos valen a la vez (duda: no hay un límite de sesiones documentado)

### Requirement: API: consulta del perfil propio

El sistema SHALL devolver los datos del usuario autenticado con `GET /api/v1/account/profile`.

#### Scenario: Token válido
- **WHEN** se hace `GET /api/v1/account/profile` con la cabecera `Authorization: Bearer <token>` de un token vigente
- **THEN** responde 200 con `{ "data": <usuario> }` correspondiente al dueño del token

### Requirement: API: las rutas de cuenta exigen autenticación

El sistema SHALL rechazar con 401 cualquier petición a `GET /api/v1/account/profile` y `POST /api/v1/account/logout` que no lleve un token de acceso válido.

#### Scenario: Sin cabecera de autorización
- **WHEN** se llama a una ruta de `/api/v1/account/` sin `Authorization`
- **THEN** responde 401

#### Scenario: Token desconocido, malformado o revocado
- **WHEN** se llama a una ruta de `/api/v1/account/` con un token que no existe, está mal formado o fue cerrado con logout
- **THEN** responde 401

#### Scenario: Caducidad del token
- **WHEN** pasa mucho tiempo desde que se emitió un token
- **THEN** duda: no se ha comprobado que los tokens tengan caducidad configurada, así que no se asegura que expiren

### Requirement: API: logout

El sistema SHALL permitir cerrar la sesión con `POST /api/v1/account/logout`, invalidando únicamente el token con el que se hizo la petición.

#### Scenario: Logout correcto
- **WHEN** se hace `POST /api/v1/account/logout` con un token vigente
- **THEN** responde 200 con `{ "message": "Logged out successfully" }` (sin envoltorio `data`) y ese token deja de ser válido

#### Scenario: Otros tokens del mismo usuario
- **WHEN** un usuario con dos tokens cierra sesión con uno de ellos
- **THEN** el otro token sigue siendo válido

#### Scenario: Reutilizar el token cerrado
- **WHEN** se llama a `GET /api/v1/account/profile` con el token ya cerrado
- **THEN** responde 401

### Requirement: API: modelo de permisos

El sistema SHALL distinguir únicamente entre peticiones anónimas y autenticadas, sin roles ni permisos por recurso dentro de este vertical.

#### Scenario: Rutas públicas
- **WHEN** una persona anónima llama a `POST /api/v1/auth/signup` o `POST /api/v1/auth/login`
- **THEN** la petición se procesa sin necesidad de token

#### Scenario: Sin roles
- **WHEN** un usuario autenticado accede a las rutas de cuenta
- **THEN** solo accede a sus propios datos; no existe rol de administrador ni endpoint para ver cuentas ajenas (duda: no se ha revisado si otros verticales aplican permisos propios)

### Requirement: API: gestión de la cuenta limitada

El sistema SHALL ofrecer hoy como gestión de cuenta solo crearla, consultar el perfil y cerrar sesión. No existe endpoint de edición del perfil, cambio ni recuperación de contraseña, verificación de email, cierre de todas las sesiones ni borrado de cuenta.

#### Scenario: Intento de editar o borrar la cuenta
- **WHEN** se llama con `PUT`, `PATCH` o `DELETE` a `/api/v1/account/profile`
- **THEN** la operación no existe (duda: el código de estado exacto no se ha comprobado con una petición real)

### Requirement: Pantalla: registro

El sistema SHALL ofrecer en `/register` un formulario "Crea tu cuenta" para registrarse, con enlace a login.

#### Scenario: Contenido del formulario
- **WHEN** una persona sin sesión abre `/register`
- **THEN** ve los campos "Nombre completo (opcional)", "Email", "Contraseña" (con la ayuda "Entre 8 y 32 caracteres.") y "Repite la contraseña", un botón "Crear cuenta" y el texto "¿Ya tienes cuenta? Inicia sesión" con enlace a `/login`

#### Scenario: Registro correcto
- **WHEN** la persona rellena datos válidos y pulsa "Crear cuenta"
- **THEN** el botón queda deshabilitado con el texto "Creando cuenta…" mientras se envía, y al terminar la persona tiene sesión iniciada y es llevada a `/profile`

#### Scenario: Nombre vacío
- **WHEN** la persona deja el nombre en blanco o solo con espacios
- **THEN** la cuenta se crea sin nombre

#### Scenario: Contraseñas distintas
- **WHEN** las dos contraseñas no coinciden al pulsar "Crear cuenta"
- **THEN** aparece bajo "Repite la contraseña" el mensaje "Las contraseñas no coinciden." y no se envía nada al servidor

#### Scenario: Email ya registrado
- **WHEN** el servidor rechaza el email por estar registrado
- **THEN** bajo el campo Email aparece "Ese email ya está registrado. Inicia sesión en su lugar."

#### Scenario: Otros errores de validación
- **WHEN** el servidor rechaza un campo por formato, longitud o ausencia
- **THEN** bajo ese campo aparece un mensaje como "Introduce una dirección de email válida.", "la contraseña debe tener al menos 8 caracteres." o "Falta rellenar el email."

#### Scenario: Servidor inaccesible o fallo interno
- **WHEN** no se puede conectar con el servidor o este responde con un error inesperado
- **THEN** una alerta roja sobre el formulario dice "No se pudo conectar con el servidor. Comprueba que el backend está arrancado." o "Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento."

### Requirement: Pantalla: login

El sistema SHALL ofrecer en `/login` un formulario "Inicia sesión" para entrar con email y contraseña, con enlace al registro.

#### Scenario: Contenido del formulario
- **WHEN** una persona sin sesión abre `/login`
- **THEN** ve "Entra con tu cuenta para volver a tus tareas.", los campos "Email" y "Contraseña", un botón "Entrar" y el texto "¿Aún no tienes cuenta? Crea una" con enlace a `/register`

#### Scenario: Login correcto
- **WHEN** la persona introduce credenciales correctas y pulsa "Entrar"
- **THEN** el botón queda deshabilitado con el texto "Entrando…" mientras se envía, y después es llevada a `/profile`

#### Scenario: Credenciales incorrectas
- **WHEN** el email o la contraseña no son correctos
- **THEN** aparece una alerta roja "El email o la contraseña no son correctos." y los campos conservan lo escrito

#### Scenario: Validación de campos
- **WHEN** falta un campo o el email no es válido
- **THEN** el mensaje de error aparece bajo el campo correspondiente

### Requirement: Pantalla: perfil

El sistema SHALL mostrar en `/profile` los datos de la cuenta con sesión iniciada.

#### Scenario: Cuenta con nombre
- **WHEN** una persona autenticada abre `/profile` y su cuenta tiene nombre
- **THEN** ve un círculo con sus iniciales, su nombre completo, su email y la fila "Miembro desde" con la fecha de alta en formato largo en castellano (por ejemplo "5 de octubre de 2026")

#### Scenario: Cuenta sin nombre
- **WHEN** la cuenta no tiene nombre
- **THEN** en lugar del nombre se ve "Sin nombre"

#### Scenario: Sin edición
- **WHEN** la persona está en el perfil
- **THEN** no puede editar nombre, email ni contraseña, ni borrar la cuenta; la única acción es "Cerrar sesión"

### Requirement: Pantalla: cierre de sesión

El sistema SHALL permitir cerrar sesión con el botón "Cerrar sesión" del perfil.

#### Scenario: Cierre correcto
- **WHEN** la persona pulsa "Cerrar sesión"
- **THEN** el botón queda deshabilitado con el texto "Cerrando sesión…", la sesión local desaparece y es llevada a `/login`

#### Scenario: El servidor falla al cerrar
- **WHEN** la llamada de logout al servidor falla o el token ya no valía
- **THEN** la persona sale igualmente a `/login` sin ver error

### Requirement: Pantalla: protección de rutas

El sistema SHALL limitar `/profile` a personas con sesión y `/login` y `/register` a personas sin ella.

#### Scenario: Perfil sin sesión
- **WHEN** una persona sin sesión abre `/profile`
- **THEN** es redirigida a `/login`

#### Scenario: Login o registro con sesión
- **WHEN** una persona con sesión abre `/login` o `/register`
- **THEN** es redirigida a `/profile`

#### Scenario: Ruta desconocida
- **WHEN** se abre cualquier otra dirección, incluida `/`
- **THEN** se redirige a `/profile` y, si no hay sesión, de ahí a `/login`

#### Scenario: Comprobando la sesión
- **WHEN** la aplicación arranca con un token guardado y aún no sabe si vale
- **THEN** se ve un indicador de carga a pantalla completa y no se redirige hasta tener respuesta

### Requirement: Pantalla: la sesión persiste entre recargas

El sistema SHALL conservar la sesión en el navegador y validarla contra el servidor al abrir o recargar la aplicación.

#### Scenario: Recarga con sesión válida
- **WHEN** la persona recarga la página con sesión iniciada y el servidor reconoce su token
- **THEN** permanece en la aplicación y sigue viendo su perfil sin volver a introducir credenciales

#### Scenario: Token rechazado
- **WHEN** al arrancar el servidor responde 401 al token guardado
- **THEN** la sesión guardada se borra, se lleva a `/login` y la alerta dice "Tu sesión ha caducado. Vuelve a iniciar sesión."

#### Scenario: Servidor caído al arrancar
- **WHEN** al arrancar no se puede validar el token porque el servidor no responde o falla
- **THEN** la persona ve `/login` con el motivo en la alerta, pero el token guardado se conserva y al recargar con el servidor de vuelta se recupera la sesión

#### Scenario: Token invalidado durante el uso
- **WHEN** el token deja de valer mientras la persona navega sin recargar
- **THEN** duda: el perfil no hace más llamadas autenticadas, por lo que no se espera ningún cambio visible hasta recargar

*************
ParteB
1- cantidad de requisitos
El agente escribió 17 requisitos
yo escribi 8

2- Incoherencias
 Requirement: API: las respuestas correctas van envueltas en `data` (es parte de como escribir código no requisito)


3- bug o contrato

Requirement: API: gestión de la cuenta limitada

Scenario: El servidor falla al cerrar

Scenario: Servidor inaccesible o fallo interno

Scenario: Cuerpo mal formado


PROMPT DEL AGENTE

"Escribe la spec de lo que Flowsync hace HOY, solo del vertical de
cuentas y acceso (registro, login/logout, sesión, permisos, gestión
de la cuenta), en dos capas: API y pantalla. Guárdala en
openspec/specs/cuentas-acceso/spec.md. No toques el código ni
ningún otro archivo.

Formato obligatorio, en castellano (salvo SHALL/MUST de la RFC):
- "## Purpose" de 1-2 frases.
- "## Requirements" y debajo "### Requirement:" en los que el
  sistema SHALL hacer algo.
- Cada requisito con al menos un "#### Scenario:" (cuatro
  almohadillas) con dos viñetas:
  - **WHEN** (la precondición va dentro del WHEN; no hay GIVEN)
  - **THEN**
Prohibido: secciones ADDED/MODIFIED/REMOVED; nombres de clase,
archivo o ruta de código. Solo comportamiento observable desde
fuera: en API, petición y respuesta (método, endpoint, códigos de
estado, cuerpo); en pantalla, lo que una persona ve y puede hacer.
Si no estás seguro de un comportamiento, márcalo como duda en vez
de inventarlo. No cubras otros verticales (Jira, flujos, etc.) ni
te ofrezcas a hacerlo. Al terminar, dime solo cuántos requisitos
escribiste."