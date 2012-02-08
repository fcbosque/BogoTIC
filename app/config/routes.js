module.exports = {
  root: [
    ['get', '/',       'Home', 'index'],
    ['get', '/acerca', 'Home', 'acerca'],
    ['get', '/ayuda',  'Home', 'ayuda'],
    ['get', '/tos',    'Home', 'tos']
  ],
  foros: [
    ['get',   '/',      'Foro', 'index'],
    ['get',   '/nuevo', 'Foro', 'new'],
    ['post',  '/',      'Foro', 'create'],
    ['get',   '/:id',   'Foro', 'show'],
    ['del',   '/:id',   'Foro', 'remove'],
    ['put',   '/:id',   'Foro', 'modify'],
    // Pregunta
    ['get',   '/:foro/preguntas',       'Pregunta', 'index'],
    ['get',   '/:foro/preguntas/nueva', 'Pregunta', 'new'],
    ['post',  '/:foro/preguntas',       'Pregunta', 'create'],
    ['get',   '/:foro/preguntas/:id',   'Pregunta', 'show'],
    ['del',   '/:foro/preguntas/:id',   'Pregunta', 'remove'],
    ['put',   '/:foro/preguntas/:id',   'Pregunta', 'modify'],
    // Seguimiento
    ['get',   '/:foro/seguimientos',       'Seguimiento', 'index'],
    ['get',   '/:foro/seguimientos/nuevo', 'Seguimiento', 'new'],
    ['post',  '/:foro/seguimientos',       'Seguimiento', 'create'],
    ['get',   '/:foro/seguimientos/:id',   'Seguimiento', 'show'],
    ['del',   '/:foro/seguimientos/:id',   'Seguimiento', 'remove'],
    ['put',   '/:foro/seguimientos/:id',   'Seguimiento', 'modify'],
    // Seguimiento / Preguntas
    ['get',   '/:foro/seguimientos/:seguimiento/preguntas',       'Seguimiento', 'getPreguntas'],
    ['get',   '/:foro/seguimientos/:seguimiento/preguntas/nueva', 'Seguimiento', 'newPregunta'],
    ['post',  '/:foro/seguimientos/:seguimiento/preguntas',       'Seguimiento', 'addPregunta'],
    ['get',   '/:foro/seguimientos/:seguimiento/preguntas/:id',   'Seguimiento', 'getPregunta'],
    ['del',   '/:foro/seguimientos/:seguimiento/preguntas/:id',   'Seguimiento', 'delPregunta'],
    ['put',   '/:foro/seguimientos/:seguimiento/preguntas/.id',   'Seguimiento', 'editPregunta'],
    // Seguimiento / Consultas
    ['get',   '/:foro/seguimientos/:seguimiento/consultas',       'Seguimiento', 'getConsultas'],
    ['get',   '/:foro/seguimientos/:seguimiento/consultas/nueva', 'Seguimiento', 'newConsulta'],
    ['post',  '/:foro/seguimientos/:seguimiento/consultas',       'Seguimiento', 'addConsulta'],
    ['get',   '/:foro/seguimientos/:seguimiento/consultas/:id',   'Seguimiento', 'getConsulta'],
    ['del',   '/:foro/seguimientos/:seguimiento/consultas/:id',   'Seguimiento', 'delConsulta'],
    ['put',   '/:foro/seguimientos/:seguimiento/consultas/:id',   'Seguimiento', 'editConsulta']
  ],
  usuarios: [
    ['get',   '/',          'Usuario', 'index'],
    ['get',   '/nuevo',     'Usuario', 'new'],
    ['post',  '/',          'Usuario', 'create'],
    ['get',   '/:username', 'Usuario', 'show'],
    ['del',   '/:username', 'Usuario', 'remove'],
    ['put',   '/:username', 'Usuario', 'modify']
  ]
}
