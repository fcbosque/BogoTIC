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
  this.viewFolder = 'seguimiento'
}).methods({
    /**
     * Renderiza el listado de grupos de seguimiento.
     * 
     * Los objetos que se envian a la plantilla son
     *
     *  - `foros` arreglo de objetos foro
     *  - `foro` objeto foro a quien pertenecen los grupos
     *  - `seguimientos` objeto seguimiento que hacen parte de ese foro
     * 
     * @api public
     * @render seguimiento/index
     * @param {Object} foro
     * @param {Integer} seguimiento
     * @see ApplicationController.index
     * @see ForoModel.show
     * @see SeguimientoModel.all
     */

    index: function() {
      var self = this;
      var foro = this.request.params.foro;
      var seguimiento = this.request.params.id;
      this.getModel('Foro').show(foro, function(err, foro) {
        if (foro) {
          self.locals.foro = {
            id: foro._id,
            nombre: foro.nombre,
            fecha: foro.fecha,
            categoria: foro.categoria
          };
        }
        self.getModel('Seguimiento').all(foro, function(err, seguimientos) {
          if (seguimientos) {
            self.locals.seguimientos = seguimientos;
          }
          self.render('index', self.locals);
        })
      });
    },

    /**
     * Renderiza el formulario para la creación de grupo de seguimiento.
     *
     * Los objetos que se envian a la plantilla son
     *
     *  - `foros` arreglo de objetos foro
     *  - `foro` objeto foro
     *    - `id` id del foro
     *    - `nombre` nombre del foro
     * 
     * @api public
     * @render seguimiento/show
     * @param {Integer} foro
     * @see ApplicationController.new
     * @see ForoModel.show
     */

    new: function() {
      var self = this;
      var foro = this.request.params.foro;
      this.getModel('Foro').show(foro, function(err, foro) {
        if (foro) {
          self.locals.foro = { id: foro._id,
            nombre: foro.nombre
          };
        }
        self.render('new', self.locals);
      });
    },

    /**
     * Crea un nuevo grupo de seguimiento para un foro en particular.
     *
     * El nuevo seguimiento se construye mediante los middlewares de
     * express para luego ser enviado al modelo de Foro para ser
     * referenciado. Los grupos de seguimiento se almacenan en su
     * propia colección. Arroja una excepción en caso de error.
     *
     * @api public
     * @redirect /foros/:foro/seguimientos
     * @param {Integer} foro
     * @param {Object} seguimiento
     * @see ApplicationController.create
     * @see SeguimientoModel.create
     */

    create: function() {
      var self = this;
      var foro = this.request.params.foro;
      var seguimiento = this.request.body.seguimiento;
      this.getModel('Seguimiento').create(foro, seguimiento, function() {
        self.response.redirect("/foros/" + foro + "/seguimientos");
      });
    },

    /**
     * Renderiza un grupo de seguimiento para un foro en particular.
     *
     * Los objetos que se envian a la plantilla son
     *
     *  - `foros` arreglo de objetos foro
     *  - `foro` objeto con las siguientes propiedades
     *    - `nombre` nombre del foro
     *    - `id` id del foro
     *  - `seguimiento` objeto del seguimiento
     *
     * @api public
     * @render seguimiento/show
     * @param {Integer} foro
     * @param {Integer} seguimiento
     * @see ApplicationController.show
     * @see ForoModel.show
     * @see SeguimientoModel.show
     */

    show: function() {
      var self = this;
      var foroId = this.request.params.foro;
      var seguimientoId = this.request.params.id;
      this.getModel('Foro').show(foroId, function(err, foro) {
        if (foro) {
          self.locals.foro = { id: foro.id,
            nombre: foro.nombre
          };
        }
        self.getModel('Seguimiento').show(seguimientoId, function(err, seguimiento) {
          if (seguimiento) {
            self.locals.seguimiento = seguimiento;
          }
          self.render('show', self.locals);
        });
      });
    },

    /**
     * Elimina un grupo de seguimiento de un foro en particular.
     *
     * @api public
     * @redirect /foros/:foro/seguimientos
     * @param {Integer} id
     * @see ApplicationController.remove
     * @see SeguimientoModel.remove
     */

    remove: function() {
      var self = this;
      var id = this.request.params.id;
      this.getModel('Seguimiento').remove(id, function(seguimiento) {
        self.send(200);
      })
    },

    /**
     * Modifica un grupo de seguimiento de un foro en particular.
     *
     * @api public
     * @redirect /foros/:foro/seguimientos/:id
     * @see ApplicationController.modify
     * @see SeguimientoModel.modify
     */

    modify: function() {
      var self = this;
      var id = this.request.params.id;
      this.getModel('Seguimiento').modify(id, params, function(foro) {
        self.send(200);
      });
    },

    /**
     * Añade una nueva pregunta a un grupo de seguimiento en particular.
     *
     * @api public
     * @redirect /foros/:foro/seguimientos/:id
     * @param {Integer} foro
     * @param {Integer} seguimiento
     * @param {Object} pregunta
     * @see SeguimientoModel.addPregunta
     */

    addPregunta: function() {
      var self = this;
      var foro = this.request.params.foro;
      var seguimiento = this.request.params.seguimiento;
      var pregunta = this.request.body.pregunta;
      this.getModel('Seguimiento').addPregunta(seguimiento, pregunta, function() {
        self.response.redirect('/foros/' + foro + '/seguimientos/' + seguimiento);
      });
    },

    /**
     * Añade una nueva consulta a un grupo de seguimiento en particular.
     *
     * @api public
     * @redirect /foros/:foro/seguimientos/:id
     * @param {Integer} foro
     * @param {Integer} seguimiento
     * @param {Object} consulta
     * @see SeguimientoModel.addConsulta
     */

    addConsulta: function() {
      var self = this;
      var foro = this.request.params.foro;
      var seguimiento = this.request.params.seguimiento;
      var consulta = this.request.body.consulta;
      this.getModel('Seguimiento').addConsulta(seguimiento, consulta, function() {
        self.response.redirect('/foros/' + foro + '/seguimientos/' + seguimiento);
      });
    },
    getConsulta: function() {
      var self = this;
      var foro = this.request.params.foro;
      var seguimiento = this.request.params.seguimiento;
      var consulta = this.request.params.id;
      this.getModel('Seguimiento').getConsulta(seguimiento, consulta, function () {
        self.response.redirect('/foros/' + foro + '/seguimientos/' + seguimiento + '/consulta/' + consulta);
      });
    },
    getPregunta: function() {

    },
    addSeguidor: function() {

    },
    delSeguidor: function() {

    }
  })
