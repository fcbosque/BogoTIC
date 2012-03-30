/*!
 * This file is part of Foros BogoTIC.
 *
 * Foros BogoTIC is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Foros BogoTIC is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Foros BogoTIC.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * Rutas disponibles en la aplicación.
 *
 * Cada ruta va con su controlador y método correspondiente.
 *
 * @api public
 */

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
    ['post',  '/:foro/preguntas',       'Pregunta', 'create'],
    ['get',   '/:foro/preguntas/:id',   'Pregunta', 'show'],
    ['del',   '/:foro/preguntas/:id',   'Pregunta', 'remove'],
    ['put',   '/:foro/preguntas/:id',   'Pregunta', 'modify'],
    // Seguimiento
    ['get',   '/:foro/seguimientos',       'Seguimiento', 'index'],
    ['post',  '/:foro/seguimientos',       'Seguimiento', 'create'],
    ['get',   '/:foro/seguimientos/:id',   'Seguimiento', 'show'],
    ['del',   '/:foro/seguimientos/:id',   'Seguimiento', 'remove'],
    ['put',   '/:foro/seguimientos/:id',   'Seguimiento', 'modify'],
    // Seguimiento / Preguntas
    ['get',   '/:foro/seguimientos/:seguimiento/preguntas',       'Seguimiento', 'getPreguntas'],
    ['post',  '/:foro/seguimientos/:seguimiento/preguntas',       'Seguimiento', 'addPregunta'],
    ['get',   '/:foro/seguimientos/:seguimiento/preguntas/:id',   'Seguimiento', 'getPregunta'],
    ['del',   '/:foro/seguimientos/:seguimiento/preguntas/:id',   'Seguimiento', 'delPregunta'],
    ['put',   '/:foro/seguimientos/:seguimiento/preguntas/.id',   'Seguimiento', 'editPregunta'],
    // Seguimiento / Consultas
    ['get',   '/:foro/seguimientos/:seguimiento/consultas',       'Seguimiento', 'getConsultas'],
    ['post',  '/:foro/seguimientos/:seguimiento/consultas',       'Seguimiento', 'addConsulta'],
    ['get',   '/:foro/seguimientos/:seguimiento/consultas/:id',   'Seguimiento', 'getConsulta'],
    ['del',   '/:foro/seguimientos/:seguimiento/consultas/:id',   'Seguimiento', 'delConsulta'],
    ['put',   '/:foro/seguimientos/:seguimiento/consultas/:id',   'Seguimiento', 'editConsulta']
  ],
  usuarios: [
    ['post',  '/',          'Usuario', 'create'],
    ['get',   '/dashboard', 'Usuario', 'index'],
    ['get',   '/nuevo',     'Usuario', 'new'],
    ['get',   '/perfil',    'Usuario', 'getPerfil'],
    ['post',  '/login',     'Usuario', 'login'],
    ['get',   '/:username', 'Usuario', 'show'],
    ['del',   '/:username', 'Usuario', 'remove'],
    ['put',   '/:username', 'Usuario', 'modify']
  ]
}
