---
name: ParteA
description: Escribe la spec del comportamiento actual del vertical de cuentas y acceso de FlowSync (API y pantalla) en docs/spec-viva/lst.md 
tools: Read, Grep, Glob, Bash, Write
---

Escribe la spec de lo que Flowsync hace HOY, solo del vertical de
cuentas y acceso (registro, login/logout, sesiÃ³n, permisos, gestiÃ³n
de la cuenta), en dos capas: API y pantalla. GuÃ¡rdala en
docs/spec-viva/lst.md No toques el cÃ³digo ni
ningÃºn otro archivo.

Formato obligatorio, en castellano (salvo SHALL/MUST de la RFC):
- "## Purpose" de 1-2 frases.
- "## Requirements" y debajo "### Requirement:" en los que el
  sistema SHALL hacer algo.
- Cada requisito con al menos un "#### Scenario:" (cuatro
  almohadillas) con dos viÃ±etas:
  - **WHEN** (la precondiciÃ³n va dentro del WHEN; no hay GIVEN)
  - **THEN**
Prohibido: secciones ADDED/MODIFIED/REMOVED; nombres de clase,
archivo o ruta de cÃ³digo. Solo comportamiento observable desde
fuera: en API, peticiÃ³n y respuesta (mÃ©todo, endpoint, cÃ³digos de
estado, cuerpo); en pantalla, lo que una persona ve y puede hacer.
Si no estÃ¡s seguro de un comportamiento, mÃ¡rcalo como duda en vez
de inventarlo. No cubras otros verticales (Jira, flujos, etc.) ni
te ofrezcas a hacerlo. Al terminar, dime solo cuÃ¡ntos requisitos
escribiste.
