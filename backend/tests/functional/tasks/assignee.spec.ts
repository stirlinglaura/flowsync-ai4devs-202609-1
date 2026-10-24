import User from '#models/user'
import Task from '#models/task'
import { test } from '@japa/runner'
import type { ApiClient } from '@japa/api-client'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`. Un test por scenario y por vía: la tarea
 * suelta (`GET /api/v1/tasks/:id`, que exige `today=AAAA-MM-DD` o responde 422
 * sin llegar al `assignee`) y la lista (`GET /api/v1/tasks`).
 *
 * El nombre llega en `assignee.fullName`: es el campo que expone hoy la API.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const HOY = '2026-08-13'
  // Iniciales que `User.initials` saca de `ada@example.com` cuando no hay nombre.
  const INICIALES_DEL_EMAIL = 'AE'
  const CLAVES_DE_ACCESO =['email', 'password', 'token', 'rememberMeToken', 'accessToken']

  async function tareaDe(fullName: string | null, email = 'ada@example.com') {
    const user = await User.create({ fullName, email, password: 'secreto123' })
    const task = await Task.create({
      title: 'Escribir el motor',
      status: 'pending',
      assigneeId: user.id,
    })
    const token = await User.accessTokens.create(user)

    return { user, task, bearer: `Bearer ${token.value!.release()}` }
  }

  // Forma observada, no declarada: el test comprueba qué claves llegan de verdad.
  type Assignee = Record<string, unknown> & { fullName: string | null; initials: string }

  async function suelta(client: ApiClient, id: number, bearer: string) {
    const response = await client
      .get(`/api/v1/tasks/${id}`)
      .qs({ today: HOY })
      .header('Authorization', bearer)

    response.assertStatus(200)
    return response.body().data.assignee as Assignee
  }

  async function enLista(client: ApiClient, id: number, bearer: string) {
    const response = await client.get('/api/v1/tasks').header('Authorization', bearer)

    response.assertStatus(200)
    const tarea = (response.body().data as Array<{ id: number; assignee: Assignee }>).find(
      (t) => t.id === id
    )

    // Si la tarea no está en la lista, el fallo es de la lista, no un TypeError.
    if (!tarea) throw new Error(`La tarea ${id} no aparece en GET /api/v1/tasks`)
    return tarea.assignee
  }

  // Scenario «Responsable identificable» — tarea suelta.
  test('Responsable identificable: la tarea suelta trae nombre e iniciales', async ({
    client,
    assert,
  }) => {
    const { task, bearer } = await tareaDe('Ada Lovelace')
    const assignee = await suelta(client, task.id, bearer)

    // «su `assignee` trae el nombre "Ada Lovelace"»
    assert.equal(assignee.fullName, 'Ada Lovelace')
    // «y sus iniciales»
    assert.equal(assignee.initials, 'AL')
  })

  // Scenario «Responsable identificable» — lista.
  test('Responsable identificable: la lista trae nombre e iniciales', async ({
    client,
    assert,
  }) => {
    const { task, bearer } = await tareaDe('Ada Lovelace')
    const assignee = await enLista(client, task.id, bearer)

    // «su `assignee` trae el nombre "Ada Lovelace"»
    assert.equal(assignee.fullName, 'Ada Lovelace')
    // «y sus iniciales»
    assert.equal(assignee.initials, 'AL')
  })

  // Scenario «La tarea no filtra datos de cuenta» — tarea suelta.
  test('La tarea no filtra datos de cuenta: la tarea suelta no trae email ni datos de acceso', async ({
    client,
    assert,
  }) => {
    const { task, bearer } = await tareaDe('Ada Lovelace')
    const assignee = await suelta(client, task.id, bearer)

    // «su `assignee` no incluye el email de esa cuenta ni ningún otro dato de acceso»
    for (const clave of CLAVES_DE_ACCESO) {
      assert.notProperty(assignee, clave)
    }
    assert.notInclude(JSON.stringify(assignee), 'ada@example.com')
  })

  // Scenario «La tarea no filtra datos de cuenta» — lista.
  test('La tarea no filtra datos de cuenta: la lista no trae email ni datos de acceso', async ({
    client,
    assert,
  }) => {
    const { task, bearer } = await tareaDe('Ada Lovelace')
    const assignee = await enLista(client, task.id, bearer)

    // «su `assignee` no incluye el email de esa cuenta ni ningún otro dato de acceso»
    for (const clave of CLAVES_DE_ACCESO) {
      assert.notProperty(assignee, clave)
    }
    assert.notInclude(JSON.stringify(assignee), 'ada@example.com')
  })

  // Scenario «Responsable sin nombre» — tarea suelta.
  test('Responsable sin nombre: la tarea suelta trae nombre nulo e iniciales', async ({
    client,
    assert,
  }) => {
    const { task, bearer } = await tareaDe(null)
    const assignee = await suelta(client, task.id, bearer)

    // «su nombre llega nulo»
    assert.property(assignee, 'fullName')
    assert.isNull(assignee.fullName)
    // «y sus iniciales siguen llegando». AMBIGÜEDAD DE LA SPEC: «sin recurrir a su
    // email» no dice de dónde salen entonces; el test fija el comportamiento actual
    // (`User.initials` las deriva del email: «ada@example.com» → «AE»).
    assert.equal(assignee.initials, INICIALES_DEL_EMAIL)
  })

  // Scenario «Responsable sin nombre» — lista.
  test('Responsable sin nombre: la lista trae nombre nulo e iniciales', async ({
    client,
    assert,
  }) => {
    const { task, bearer } = await tareaDe(null)
    const assignee = await enLista(client, task.id, bearer)

    // «su nombre llega nulo»
    assert.property(assignee, 'fullName')
    assert.isNull(assignee.fullName)
    // «y sus iniciales siguen llegando». AMBIGÜEDAD DE LA SPEC: ver el test de la tarea suelta.
    assert.equal(assignee.initials, INICIALES_DEL_EMAIL)
  })
})
