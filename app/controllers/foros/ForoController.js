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

module.exports = require(app.set('controllers') + '/ApplicationController').extend(function() {
  this.viewFolder = 'foro';
}).methods({
    /**
     * Renderiza el listado de foros.
     * 
     * Los objetos que se envian a la plantilla son
     *
     *  - `foros` arreglo de objetos foro
     *  - `total_foros` longitud del arreglo `foros`
     * 
     * @api public
     * @render foro/index
     * @param {Object} foros
     * @see ApplicationController.index
     */

    index: function() {
      this.render('index', this.locals);
    },

    /**
     * Renderiza el formulario para la creación de foros.
     *
     * Los objetos que se envian a la plantilla son
     *
     *  - `foros` arreglo de objetos foro
     * 
     * @api public
     * @render foro/new
     * @see ApplicationController.new
     */

    new: function() {
      this.render('new', this.locals);
    },

    /**
     * Crea un nuevo foro en la base de datos.
     *
     * El nuevo foro se construye mediante los middlewares de
     * express para luego ser enviado al modelo de Foro para ser
     * almacenado. Arroja una excepción en caso de error.
     *
     * @api public
     * @redirect /foros
     * @param {Object} foro
     * @see ApplicationController.create
     * @see ForoModel.create
     */

    create: function() {
      var self = this;
      var foro = this.request.body.foro
      this.getModel('Foro').create(foro, function(err) {
        if(err) throw new Error(err);
      })
      this.response.redirect('/foros');
    },

    /**
     * Renderiza un foro en particular.
     *
     * Los objetos que se envian a la plantilla son
     *
     *  - `foros` arreglo de objetos foro
     *  - `foro` objeto con las siguientes propiedades
     *    - `nombre` nombre del foro
     *    - `id` id del foro
     *    - `fecha` fecha de realización del foro
     *    - `preguntas` arreglo de objetos pregunta
     *    - `descripcion` descripción del foro
     *
     * @api public
     * @render foros/show
     * @param {Integer} foro
     * @see ApplicationController.show
     * @see ForoModel.show
     */

    show: function() {
      var self = this;
      var foro = this.request.params.id
      this.getModel('Foro').show(foro, function(err, foro) {
        if (foro) {
          self.locals.foro = { nombre: foro.nombre,
            id: foro._id,
            fecha: foro.fecha,
            preguntas: foro.preguntas,
            descripcion: foro.descripcion
          }
        }
        self.render('show', self.locals);
      })
    },

    /**
     * Elimina un foro en particular.
     *
     * @api public
     * @redirect /foros
     * @param {Integer} id
     * @see ApplicationController.remove
     * @see ForoModel.remove
     */

    remove: function() {
      var self = this;
      var id = this.request.params.id;
      this.getModel('Foro').remove(id, function(foro) {
        self.send(200);
      })
    },

    /**
     * Modifica un foro en particular.
     *
     * @api public
     * @redirect /foro/:id
     * @param {Integer} id 
     * @param {Object} params
     * @see ApplicationController.modify
     * @see ForoModel.modify
     */

    modify: function() {
      var self = this;
      var id = this.request.params.id;
      this.getModel('Foro').modify(id, params, function(foro) {
        self.send(200);
      });
    }
  })
