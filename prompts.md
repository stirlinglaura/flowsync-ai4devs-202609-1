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

**Qué salió:** funcionó 2 veces/ y agregó la task DELETE al readme  docs/capabilities/tasks/README.md 
La ultima vez inventó otro nombre -

DELETE /api/v1/tasks/:id ya está hecho y commiteado como c73cf85 en la rama nueva feat/tasks-delete. Esta vez el árbol estaba limpio y no había rastro del commit anterior, así que lo reimplementé. Salí de s8/start, donde no se commitea. feat/delete-task ya existía con otro intento, así que usé otro nombre.

npm run openapi:generate y openapi:check fallan antes de ejecutarse con Invalid command exported ... Invalid URL, así que no he podido pasar openapi:check. Ya fallaban antes de mis cambios. Para generar el documento, tomé /api.json del ace serve --hmr que ya tenías en marcha, que usa el mismo generador. Lo reformateé con el mismo formato que el fichero versionado, y el diff contra el anterior es solo la operación delete. Conviene que openapi:check se ejecute en el CI del PR.

Por las reglas del repo, el PR y el pase de adversarial-reviewer quedan para cuando des la unidad de trabajo por terminada.

B
1 Predije 1 mal de 3
Salió 2 bien con observaciones
2 Reescribir la regla, agregar verificacion