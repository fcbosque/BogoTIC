module.exports = {
  root: [
    ['get', '/', 'Home', 'index'],
    ['get', '/acerca', 'Home', 'acerca'],
    ['get', '/ayuda', 'Home', 'ayuda'],
    ['get', '/tos', 'Home', 'tos'],
    // Foro
    ['get', '/foros', 'Foro', 'index'],
    ['get', '/foros/new', 'Foro', 'new'],
    ['post', '/foro', 'Foro', 'create'],
    ['get', '/foro/:id', 'Foro', 'show'],
    ['del', '/foro/:id', 'Foro', 'remove'],
    ['put', '/foro/:id', 'Foro', 'modify'],
    // Usuario
    ['get', '/usuarios', 'Usuario', 'index'],
    ['get', '/usuarios/new', 'Usuario', 'new'],
    ['post', '/usuario', 'Usuario', 'create'],
    ['get', '/usuario/:username', 'Usuario', 'show'],
    ['del', '/usuario/:username', 'Usuario', 'remove'],
    ['put', '/usuario/:username', 'Usuario', 'modify'],
    // Pregunta
    ['get', '/foro/:foro/preguntas', 'Pregunta', 'index'],
    ['get', '/foro/:foro/preguntas/new', 'Pregunta', 'new'],
    ['post', '/foro/:foro/pregunta', 'Pregunta', 'create'],
    ['get', '/foro/:foro/pregunta/:id', 'Pregunta', 'show'],
    ['del', '/foro/:foro/pregunta/:id', 'Pregunta', 'remove'],
    ['put', '/foro/:foro/pregunta/:id', 'Pregunta', 'modify'],
  ]
}
