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
  this.viewFolder = 'pregunta'
}).methods({
   /**
    * Renderiza el listado las preguntas.
    * 
    * Los objetos que se envian a la plantilla son
    *
    *  - `foros` arreglo de objetos foro
    *  - `foro` objeto foro compuesto de
    *    - `preguntas` arreglo de objetos pregunta
    *    - `nombre` nombre del foro
    *    - `id` id del foro
    * 
    * @api public
    * @render pregunta/index
    * @param {Integer} foro
    * @see ApplicationController.index
    * @see ForoModel.show
    */

    index: function() {
      var self = this;
      var foro = this.request.params.foro;
      this.getModel('Foro').show(foro, function(err, foro) {
        if (foro) {
          self.locals.foro = { preguntas: foro.preguntas,
            nombre: foro.nombre,
            id: foro._id
          };
        }
        self.render('index', self.locals);
      })
    },

    /**
     * Renderiza el formulario para la creación de preguntas.
     *
     * Los objetos que se envian a la plantilla son
     *
     *  - `foros` arreglo de objetos foro
     *  - `foroId` id del foro
     * 
     * @api public
     * @render pregunta/new
     * @param {Integer} foro
     * @see ApplicationController.new
     * @see ForoModel.show
     */

    new: function() {
      var self = this;
      var foro = this.request.params.foro;
      this.getModel('Foro').show(foro, function(err, foro) {
        self.locals.forId = foro._id;
        self.render('new', self.locals);
      });
    },

    /**
     * Crea un nueva pregunta en un foro determinado.
     *
     * La nueva pregunta se construye mediante los middlewares de
     * express para luego ser enviado al modelo de Foro para ser
     * almacenado. Arroja una excepción en caso de error.
     *
     * @api public
     * @redirect /foros/:id/preguntas
     * @param {Integer} foro
     * @param {Object} pregunta
     * @see ForoModel.create
     * @see ApplicationController.create
     */

    create: function() {
      var self = this;
      var foro = this.request.params.foro;
      var pregunta = this.request.body.pregunta;
      this.getModel('Foro').addPregunta(foro, pregunta, function(err) {
        if(err) throw new Error(err);
        self.response.redirect("/foros/" + foro + "/preguntas");
      });
    },

    /**
     * Renderiza una pregunta de un foro en particular.
     *
     * Los objetos que se envian a la plantilla son
     *
     *  - `foros` arreglo de objetos foro
     *  - `foro` objeto con las siguientes propiedades
     *    - `nombre` nombre del foro
     *    - `id` id del foro
     *  - `pregunta` objeto de la pregunta
     *
     * @api public
     * @render foro/show
     * @param {Integer} foro
     * @param {Integer} pregunta
     * @see ApplicationController.show
     * @see ForoModel.show
     */

    show: function() {
      var self = this;
      var foro = this.request.params.foro;
      var pregunta = this.request.params.id;
      this.getModel('Foro').getPregunta(foro, pregunta, function(err, item) {
        if (item) {
          self.locals.foro = { id: item.foro.id,
            nombre: item.foro.nombre
          };
          self.locals.pregunta = item.pregunta;
        }
        self.render('show', self.locals);
      })
    },

    /**
     * Elimina una pregunta de un foro en particular.
     *
     * @api public
     * @redirect /foros/:foro/preguntas
     * @param {Integer} id
     * @see ApplicationController.remove
     * @see ForoModel.remove
     */

    remove: function() {
      var self = this;
      var id = this.request.params.id;
      this.getModel('Pregunta').remove(id, function(err, pregunta) {
        self.send(200);
      })
    },

    /**
     * Modifica una pregunta de un foro en particular.
     *
     * @api public
     * @redirect /foros/:foro/preguntas/:id
     * @param {Integer} id
     * @see ApplicationController.modify
     * @see ForoModel.modify
     */

    modify: function() {
      var self = this;
      var id = this.request.params.id;
      this.getModel('Pregunta').modify(id, params, function(err, pregunta) {
        self.send(200);
      });
    },

    /**
     * Votar a favor/contra de una de las preguntas
     */

    votar: function () {
      var self = this,
          preguntaId = this.request.params.id,
          foroId = this.request.params.foro,
          body = this.request.body;

      if (this.request.session.usuario) {
        var userId = this.request.session.usuario._id,
            voto = 0;
        console.log('voto', body.voto);
        if (body.voto === 'favor') {
          voto = 1;
        } else if (body.voto === 'contra') {
          voto = -1;
        }
        this.getModel('Voto').registrarVoto('Foro:Pregunta', preguntaId, userId, voto, function (err, resultado) {
          if (!err && resultado) {
            self.response.send(202);
          } else {
            self.response.send(err.message, 500)
          }
        });
      } else {
        self.response.send('Necesita iniciar sesion para votar', 401);
      }
    }
  })
